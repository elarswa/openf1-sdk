import axios from "axios";
import * as fs from "node:fs";
const SESSION = "latest";

const RouteTargetsToUrlFunc = {
	interval: { urlFunc: buildIntervalsUrl, useInterval: true },
	drivers: { urlFunc: buildDriversUrl, useInterval: false },
	sessions: { urlFunc: buildSessionsUrl, useInterval: false },
};

const routeCallInput = {
	interval: {
		session_key: SESSION,
		interval: 0.005,
	},
	drivers: {
		session_key: SESSION,
	},
	sessions: {
		session_key: SESSION,
	},
};

async function main() {
	const [, , ...args] = process.argv;
	const [filePath, routeTarget, interval] = args;

	if (!filePath || !routeTarget || !interval) {
		console.log("Usage: node index.js <filePath> <routeTarget> <interval>");
		process.exit(1);
	}

	if (RouteTargetsToUrlFunc[routeTarget] === undefined) {
		console.log("Invalid route target");
		console.log(
			"Valid route targets: ",
			Object.keys(RouteTargetsToUrlFunc).join("\n"),
		);
		process.exit(0);
	}

	const writeStream = fs.createWriteStream(filePath, { flags: "a" });

	setInterval(
		() => {
			// hit api, writeLine of data
			axios.get(
				RouteTargetsToUrlFunc[routeTarget].urlFunc({ session_key: SESSION }),
			);
		},
		Number.parseInt(interval, 10),
	);
}

function writeLine({
	writeStream,
	data,
}: {
	writeStream: fs.WriteStream;
	data: Record<string, unknown>;
}) {
	return new Promise((resolve, reject) => {
		if (writeStream.write(data)) {
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
