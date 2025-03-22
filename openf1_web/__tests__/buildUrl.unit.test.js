import axios from "axios";

import { OpenF1Request } from "../api.doc";
jest.mock("axios");

describe("OpenF1Request", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call axios.get with the correct URL for the "/drivers" endpoint', async () => {
		const expectedUrl = "https://api.openf1.org/v1/drivers?season=2023";
		axios.get.mockResolvedValue({ data: {} });

		await OpenF1Request("/drivers", { queryParams: { season: 2023 } });

		expect(axios.get).toHaveBeenCalledWith(expectedUrl);
	});

	it('should call axios.get with the correct URL for the "/drivers" endpoint', async () => {
		const expectedUrl =
			"https://api.openf1.org/v1/intervals?session_key=latest&driver_number=2";
		axios.get.mockResolvedValue({ data: {} });

		await OpenF1Request("/intervals", {
			queryParams: { session_key: "latest", driver_number: 2 },
		});

		expect(axios.get).toHaveBeenCalledWith(expectedUrl);
	});
});
