let currentStatus = [];

function compareStatus(current, expected) {
	for (let i = 0; i < current.length; i++) {
		if (current[i] !== expected[i]) return "mismatch";
	}
	if (current.length < expected.length) return "waiting";
	return true;
}

export default (expectedCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], cb) => {
	window.addEventListener("keyup", (e) => {
		currentStatus.push(e.keyCode);
		const comparisonResult = compareStatus(currentStatus, expectedCode);
		if (comparisonResult === true) {
			cb && cb();
			const kcEvent = new Event("konamicode");
			window.dispatchEvent(kcEvent);
			currentStatus = [];
		} else if (comparisonResult === "mismatch") {
			currentStatus = [];
		}
	})
}