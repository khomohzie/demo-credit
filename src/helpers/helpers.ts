import moment from "moment";

export async function convertTotalTime({
	time,
}: {
	time: number;
}): Promise<string> {
	const formattedSeconds = moment()
		.startOf("day")
		.seconds(time)
		.format("HH:mm:ss");

	return formattedSeconds;
}

interface IDuration extends moment.Duration {
	_milliseconds?: any;
}

// calculate the daily total time
export async function calculateDailyTotalTime({
	lastTotalTime,
	currentTotalTime,
}: {
	lastTotalTime: string;
	currentTotalTime: string;
}): Promise<{ unformatted?: string; formatted?: string; error?: undefined }> {
	if (!lastTotalTime || !currentTotalTime) {
		console.log("Error calculating the daily total time");
		return { error: undefined };
	}

	const durations = [lastTotalTime, currentTotalTime];

	const totalDurations: IDuration = durations
		.slice(1)
		.reduce(
			(prev, cur) => moment.duration(cur).add(prev),
			moment.duration(durations[0])
		);

	const ms = totalDurations._milliseconds;

	const ticks = ms / 1000;

	const hh = Math.floor(ticks / 3600);
	const mm = Math.floor((ticks % 3600) / 60);
	const ss = ticks % 60;

	const unformattedDailyTotal = `${hh}:${mm}:${ss}`;
	const dailyTotalTime = `${hh}h:${mm}m:${ss}s`;

	return { unformatted: unformattedDailyTotal, formatted: dailyTotalTime };
}
