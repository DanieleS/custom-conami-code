import isTouch from "is-touch-device";
import SwipeListener from "swipe-listener";

function compareStatus(current, expected, keyboard) {
	const keyType = keyboard ? "key" : "touch";
	for (let i = 0; i < current.length; i++) {
		if (current[i] !== expected[i][keyType]) return "mismatch";
	}
	if (current.length < expected.length) return "waiting";
	return true;
}

function mapTouchEvent(direction) {
	if (direction.top) return "up";
	if (direction.bottom) return "down";
	if (direction.left) return "left";
	if (direction.right) return "right";
	return "banana";
}

function isTouchEnabled(code) {
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
];

export default (expectedCode = KONAMI_CODE, cb) => {
	let currentStatus = [];
	let lastEventTypeIsKeyboard = true;
	const expected =
		typeof expectedCode[0] === "object"
			? expectedCode
			: expectedCode.map((key) => ({ key }));

	function eventListener(isTouchEvent, getEvent) {
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
		window.addEventListener("swipe", (e) =>
			eventListener(true, () => mapTouchEvent(e.detail.directions))
		);
		window.addEventListener("click", (e) =>
			eventListener(true, () => "tap")
		);
	}
};
