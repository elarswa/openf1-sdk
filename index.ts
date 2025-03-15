import axios from "axios";
import * as fs from "node:fs";
import {
	buildDriversUrl,
	buildIntervalsUrl,
	buildSessionsUrl,
} from "./openf1_web/api.doc";
const SESSION = "latest";

const RouteTargetsToUrlFunc = {
	interval: { urlFunc: buildIntervalsUrl, useInterval: true },
	drivers: { urlFunc: buildDriversUrl, useInterval: false },
	sessions: { urlFunc: buildSessionsUrl, useInterval: false },
};

const routeCallInput = {
	interval: {
		queryParams: { session_key: SESSION, interval: 0.005 },
	},
	drivers: {
		queryParams: { session_key: SESSION },
	},
	sessions: {
		queryParams: { session_key: SESSION },
	},
};

async function main() {
	const [, , ...args] = process.argv;
	const [filePath, routeTarget, interval] = args;

	if (!filePath || !routeTarget) {
		console.log("Usage: node index.js <filePath> <routeTarget> <interval>");
		process.exit(1);
	}

	if (RouteTargetsToUrlFunc?.[routeTarget] === undefined) {
		console.log("Invalid route target");
		console.log(
			"Valid route targets: ",
			Object.keys(RouteTargetsToUrlFunc).join("\n"),
		);
		process.exit(0);
	}

	if (RouteTargetsToUrlFunc?.[routeTarget]?.useInterval && !interval) {
		console.log("Interval is required for this route target");
		process.exit(0);
	}

	try {
		const writeStream = fs.createWriteStream(filePath);
		if (RouteTargetsToUrlFunc?.[routeTarget]?.useInterval) {
			setInterval(
				async () => {
					// hit api, writeLine of data
					const res = await axios.get(
						RouteTargetsToUrlFunc?.[routeTarget]?.urlFunc(
							routeCallInput[routeTarget],
						),
					);
					console.log("🚀 ~ res:", res);

					handleData(writeStream, res.data);
				},
				Number.parseInt(interval, 10),
			);
		} else {
			const res = await axios.get(
				RouteTargetsToUrlFunc?.[routeTarget]?.urlFunc(
					routeCallInput[routeTarget],
				),
			);
			handleData(writeStream, res.data);
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

function handleData(
	writeStream: fs.WriteStream,
	data: Record<string, unknown> | Record<string, unknown>[],
) {
	if (Array.isArray(data)) {
		for (const item of data) {
			writeLine({ writeStream, data: item });
		}
	} else {
		writeLine({ writeStream, data });
	}
}

function formatData(data: Record<string, unknown>): string {
	return Object.entries(data)
		.map(([key, value]) => `${key}: ${value}`)
		.join(", ")
		.concat("\n");
}

function writeLine({
	writeStream,
	data,
}: {
	writeStream: fs.WriteStream;
	data: Record<string, unknown>;
}) {
	const formattedData = formatData(data);
	return new Promise((resolve, reject) => {
		if (writeStream.write(formattedData)) {
			process.nextTick(resolve);
		} else {
			writeStream.once("drain", () => {
				writeStream.off("error", reject);
				resolve(true);
			});
			writeStream.once("error", reject);
		}
	});
}

main();
