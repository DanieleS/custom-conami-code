import isTouch from "is-touch-device";
import SwipeListener from "swipe-listener";

type DirectionObj = {
	top: boolean;
	bottom: boolean;
	left: boolean;
	right: boolean;
};

type Directions = "up" | "down" | "left" | "right";

type Code = readonly {
	key: number;
	touch: "tap" | Directions;
}[];

function compareStatus(
	current: (number | "tap" | Directions)[],
	expected: Code,
	keyboard: boolean
) {
	const keyType = keyboard ? "key" : "touch";
	for (let i = 0; i < current.length; i++) {
		if (current[i] !== expected[i][keyType]) return "mismatch";
	}
	if (current.length < expected.length) return "waiting";
	return true;
}

function mapTouchEvent(direction: DirectionObj) {
	if (direction.top) return "up";
	if (direction.bottom) return "down";
	if (direction.left) return "left";
	if (direction.right) return "right";
	return "up";
}

function isTouchEnabled(code: Code) {
	if (typeof code[0] === "number") return false;
	if (!isTouch()) return false;
	return true;
}

export const KONAMI_CODE = [
	{
		key: 38,
		touch: "up",
	},
	{
		key: 38,
		touch: "up",
	},
	{
		key: 40,
		touch: "down",
	},
	{
		key: 40,
		touch: "down",
	},
	{
		key: 37,
		touch: "left",
	},
	{
		key: 39,
		touch: "right",
	},
	{
		key: 37,
		touch: "left",
	},
	{
		key: 39,
		touch: "right",
	},
	{
		key: 66,
		touch: "tap",
	},
	{
		key: 65,
		touch: "tap",
	},
] as const;

export default (expectedCode = KONAMI_CODE, cb: () => void) => {
	let currentStatus: (number | "tap" | Directions)[] = [];
	let lastEventTypeIsKeyboard = true;

	function eventListener(
		isTouchEvent: boolean,
		getEvent: () => number | "tap" | Directions
	) {
		if (lastEventTypeIsKeyboard === isTouchEvent) {
			lastEventTypeIsKeyboard = !lastEventTypeIsKeyboard;
			currentStatus = [];
		}
		currentStatus.push(getEvent());
		const comparisonResult = compareStatus(
			currentStatus,
			expectedCode,
			lastEventTypeIsKeyboard
		);
		if (comparisonResult === true) {
			cb && cb();
			const kcEvent = new Event("codeinserted");
			window.dispatchEvent(kcEvent);
			currentStatus = [];
		} else if (comparisonResult === "mismatch") {
			currentStatus = [];
		}
	}

	window.addEventListener("keyup", (e) =>
		eventListener(false, () => e.keyCode)
	);

	if (isTouchEnabled(expectedCode)) {
		SwipeListener(window);
		window.addEventListener("swipe", (e: any) =>
			eventListener(true, () => mapTouchEvent(e.detail.directions))
		);
		window.addEventListener("click", () =>
			eventListener(true, () => "tap")
		);
	}
};
