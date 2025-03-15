const createCsvWriter = require("csv-writer").createObjectCsvWriter;

interface WriteCsvProps<T extends {}> {
	filePath: string;
	data: T[];
}

export const writeSchema = ({
	filePath,
	data,
}: WriteCsvProps<Record<string, unknown>>) => {
	const csvWriter = createCsvWriter({
		path: filePath,
		header: convertDataToHeaders(data),
	});

	csvWriter.writeRecords(data).then(() => {
		console.log(`Done writing ${filePath}`);
	});
};

export function convertDataToHeaders<T extends {}>(
	data: T[],
): Record<string, string>[] {
	const [firstItem] = data;
	return Object.entries(firstItem).map(([key, value]) => {
		return { id: key.trim().toLowerCase(), title: key.toUpperCase() };
	});
}
