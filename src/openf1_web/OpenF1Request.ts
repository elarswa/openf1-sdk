import axios, { type AxiosResponse } from "axios";
import {
	type AllowedEndpoints,
	BASE_URL,
	type EndpointMap,
	endpoints,
} from "./api.doc";

export const OpenF1Request = <
	K extends AllowedEndpoints,
	T extends EndpointMap[K]["request"],
>(
	endpoint: K,
	request: T,
): Promise<AxiosResponse<EndpointMap[K]["response"]>> => {
	if (!endpoints.includes(endpoint)) throw new Error("Invalid endpoint");

	const { queryParams } = request;
	const stringifiedQueryParams = Object.fromEntries(
		Object.entries(queryParams).map(([key, value]) => [
			key,
			typeof value === "number" ? value : String(value),
		]),
	) as Record<string, string>;

	const queryString = new URLSearchParams(stringifiedQueryParams).toString();

	const url = `${BASE_URL}${endpoint}?${queryString}`;

	return axios.get(url);
};
