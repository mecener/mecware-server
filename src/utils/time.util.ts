export function parseTimeToMs(timeString: string): number {
	const unit = timeString.slice(-1);
	const value = parseInt(timeString.slice(0, -1), 10);

	if (isNaN(value)) {
		throw new Error(`Invalid time format: ${timeString}`);
	}

	switch (unit) {
		case "s":
			return value * 1000;
		case "m":
			return value * 60 * 1000;
		case "h":
			return value * 60 * 60 * 1000;
		case "d":
			return value * 24 * 60 * 60 * 1000;
		default:
			return parseInt(timeString, 10) * 1000;
	}
}
