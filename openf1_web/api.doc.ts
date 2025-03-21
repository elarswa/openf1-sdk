import axios from "axios";

export const BASE_URL = "https://api.openf1.org/v1";

export type AllRequests =
	| CarDataRequest
	| DriversRequest
	| IntervalsRequest
	| LapsRequest
	| LocationRequest
	| MeetingsRequest
	| PitRequest
	| PositionRequest
	| RaceControlRequest
	| SessionsRequest
	| StintsRequest
	| TeamRadioRequest
	| WeatherRequest;

export type AllResponses =
	| CarDataResponse
	| DriversResponse
	| IntervalsResponse
	| LapsResponse
	| LocationResponse
	| MeetingsResponse
	| PitResponse
	| PositionResponse
	| RaceControlResponse
	| SessionsResponse
	| StintsResponse
	| TeamRadioResponse
	| WeatherResponse;

export const endpoints = [
	"/car_data",
	"/drivers",
	"/intervals",
	"/laps",
	"/location",
	"/meetings",
	"/pit",
	"/position",
	"/race_control",
	"/sessions",
	"/stints",
	"/team_radio",
	"/weather",
] as const;

export type AllowedEndpoints = (typeof endpoints)[number];

// a map of endpoint to request and response types
export interface EndpointMap {
	"/car_data": { request: CarDataRequest; response: CarDataResponse };
	"/drivers": { request: DriversRequest; response: DriversResponse };
	"/intervals": { request: IntervalsRequest; response: IntervalsResponse };
	"/laps": { request: LapsRequest; response: LapsResponse };
	"/location": { request: LocationRequest; response: LocationResponse };
	"/meetings": { request: MeetingsRequest; response: MeetingsResponse };
	"/pit": { request: PitRequest; response: PitResponse };
	"/position": { request: PositionRequest; response: PositionResponse };
	"/race_control": {
		request: RaceControlRequest;
		response: RaceControlResponse;
	};
	"/sessions": { request: SessionsRequest; response: SessionsResponse };
	"/stints": { request: StintsRequest; response: StintsResponse };
	"/team_radio": { request: TeamRadioRequest; response: TeamRadioResponse };
	"/weather": { request: WeatherRequest; response: WeatherResponse };
}

export const SendF1Request = <
	K extends AllowedEndpoints,
	T extends EndpointMap[K]["request"],
>(
	endpoint: K,
	request: T,
): Promise<ReturnType<typeof axios.get<EndpointMap[K]["response"]>>> => {
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

export const DRS_VALUES = {
	OFF: "OFF",
	ON: "ON",
	UNKNOWN: "UNKNOWN",
	DETECTED: "DETECTED",
} as const;

export const DRS = {
	0: DRS_VALUES.OFF,
	1: DRS_VALUES.OFF,
	2: DRS_VALUES.UNKNOWN,
	3: DRS_VALUES.UNKNOWN,
	8: DRS_VALUES.DETECTED,
	9: DRS_VALUES.UNKNOWN,
	10: DRS_VALUES.ON,
	12: DRS_VALUES.ON,
	14: DRS_VALUES.ON,
};

export type NumberOrLatest = number | `latest`;

// Car Data
// Example URL: https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed>=315
export interface CarDataRequest {
	queryParams: {
		driver_number?: number;
		session_key?: NumberOrLatest;
		speed?: number;
	};
}

/**
 * Represents the response data for a car in an F1 session.
 *
 * This interface provides detailed telemetry and metadata about a car's
 * performance and session context during a Formula 1 event.
 * @interface CarDataResponse
 * @property brake: Indicates whether the brake pedal is pressed (100) or not (0).
 * @property date: The UTC date and time of the data, in ISO 8601 format.
 * @property driver_number: The unique number assigned to an F1 driver.
 * @property drs: The Drag Reduction System (DRS) status.
 * @property meeting_key: The unique identifier for the meeting. Use `latest` for the latest meeting.
 * @property n_gear: Current gear selection, ranging from 1 to 8. `0` indicates neutral or no gear engaged.
 * @property rpm: Revolutions per minute of the engine.
 * @property session_key: The unique identifier for the session. Use `latest` for the latest session.
 * @property speed: Velocity of the car in kilometers per hour (km/h).
 * @property throttle: Percentage of maximum engine power being used.
 */
export interface CarDataResponse {
	brake: number;
	date: string;
	driver_number: number;
	drs: keyof typeof DRS;
	meeting_key: NumberOrLatest;
	n_gear: number;
	rpm: number;
	session_key: NumberOrLatest;
	speed: number;
	throttle: number;
}

// Drivers
// Example URL: https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158
export interface DriversRequest {
	queryParams: {
		driver_number?: number;
		session_key?: NumberOrLatest;
	};
}

/**
 * Represents the response containing information about F1 drivers.
 *
 * @interface DriversResponse
 * @property broadcast_name - The driver's name, as displayed on TV.
 * @property country_code - A code that uniquely identifies the country.
 * @property driver_number - The unique number assigned to an F1 driver.
 * @property first_name - The driver's first name.
 * @property full_name - The driver's full name.
 * @property headshot_url - URL of the driver's face photo.
 * @property last_name - The driver's last name.
 * @property meeting_key - The unique identifier for the meeting. Use `latest` for the latest meeting.
 * @property name_acronym - Three-letter acronym of the driver's name.
 * @property session_key - The unique identifier for the session. Use `latest` for the latest session.
 * @property team_colour - The hexadecimal color value (RRGGBB) of the driver's team.
 * @property team_name - Name of the driver's team.
 */
export interface DriversResponse {
	broadcast_name: string;
	country_code: string;
	driver_number: number;
	first_name: string;
	full_name: string;
	headshot_url: string;
	last_name: string;
	meeting_key: NumberOrLatest;
	name_acronym: string;
	session_key: NumberOrLatest;
	team_colour: string;
	team_name: string;
}

// Intervals
// Example URL: https://api.openf1.org/v1/intervals?session_key=9165&interval<0.005
export interface IntervalsRequest {
	queryParams: {
		session_key?: NumberOrLatest;
		interval?: number;
	};
}

/**
 * Represents the response structure for intervals data in an F1 session.
 *
 * @interface IntervalsResponse
 * @property {string} date - The UTC date and time, in ISO 8601 format.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {number | null} gap_to_leader - The time gap to the race leader in seconds, or `null` for the race leader.
 * @property {number | null} interval - The time gap to the car ahead in seconds, or `null` for the race leader.
 * @property {NumberOrLatest} meeting_key - The unique identifier for the meeting. Use `latest` for the latest meeting.
 * @property {NumberOrLatest} session_key - The unique identifier for the session. Use `latest` for the latest session.
 */
export interface IntervalsResponse {
	date: string;
	driver_number: number;
	gap_to_leader: number | null;
	interval: number | null;
	meeting_key: NumberOrLatest;
	session_key: NumberOrLatest;
}

// Laps
// Example URL: https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8
export interface LapsRequest {
	queryParams: {
		session_key?: NumberOrLatest;
		driver_number?: number;
		lap_number?: number;
	};
}

/**
 * Represents the response structure for lap data in an F1 session.
 */
/**
 * Represents the response structure for lap data in an F1 session.
 *
 * @interface LapsResponse
 * @property {string} date_start - The UTC starting date and time, in ISO 8601 format.
 * @property {number} driver_number - The unique number assigned to an F1 driver.
 * @property {number} duration_sector_1 - The time taken, in seconds, to complete the first sector of the lap.
 * @property {number} duration_sector_2 - The time taken, in seconds, to complete the second sector of the lap.
 * @property {number} duration_sector_3 - The time taken, in seconds, to complete the third sector of the lap.
 * @property {number} i1_speed - The speed of the car, in km/h, at the first intermediate point on the track.
 * @property {number} i2_speed - The speed of the car, in km/h, at the second intermediate point on the track.
 * @property {boolean} is_pit_out_lap - Whether the lap is an "out lap" from the pit.
 * @property {number} lap_duration - The total time taken, in seconds, to complete the entire lap.
 * @property {number} lap_number - The sequential number of the lap within the session.
 * @property {NumberOrLatest} meeting_key - The unique identifier for the meeting. Use `latest` for the latest meeting.
 * @property {number[]} segments_sector_1 - A list of values representing the "mini-sectors" within the first sector.
 * @property {number[]} segments_sector_2 - A list of values representing the "mini-sectors" within the second sector.
 * @property {number[]} segments_sector_3 - A list of values representing the "mini-sectors" within the third sector.
 * @property {NumberOrLatest} session_key - The unique identifier for the session. Use `latest` for the latest session.
 * @property {number} st_speed - The speed of the car, in km/h, at the speed trap.
 */
export interface LapsResponse {
	date_start: string;
	driver_number: number;
	duration_sector_1: number;
	duration_sector_2: number;
	duration_sector_3: number;
	i1_speed: number;
	i2_speed: number;
	is_pit_out_lap: boolean;
	lap_duration: number;
	lap_number: number;
	meeting_key: NumberOrLatest;
	segments_sector_1: number[];
	segments_sector_2: number[];
	segments_sector_3: number[];
	session_key: NumberOrLatest;
	st_speed: number;
}

// Location
// Example URL: https://api.openf1.org/v1/location?session_key=9161&driver_number=81&date>2023-09-16T13:03:35.200&date<2023-09-16T13:03:35.800
export interface LocationRequest {
	queryParams: {
		session_key?: NumberOrLatest;
		driver_number?: number;
		date_start?: string;
		date_end?: string;
	};
}

/**
 * Represents the response containing location data for a specific driver during a session.
 *
 * @property date - The date of the session in ISO 8601 format (e.g., "YYYY-MM-DD").
 * @property driver_number - The unique number assigned to the driver.
 * @property meeting_key - The identifier for the meeting, which can be a number or the string "latest".
 * @property session_key - The identifier for the session, which can be a number or the string "latest".
 * @property x - The X-coordinate of the driver's location on the track.
 * @property y - The Y-coordinate of the driver's location on the track.
 * @property z - The Z-coordinate (altitude) of the driver's location on the track.
 */
export interface LocationResponse {
	date: string;
	driver_number: number;
	meeting_key: NumberOrLatest;
	session_key: NumberOrLatest;
	x: number;
	y: number;
	z: number;
}

// Meetings
// Example URL: https://api.openf1.org/v1/meetings?year=2023&country_name=Singapore
export interface MeetingsRequest {
	queryParams: {
		year?: number;
		country_name?: string;
	};
}

/**
 * Represents the response structure for meeting details in the F1 data API.
 *
 * @interface MeetingsResponse
 * @property {number} circuit_key - The unique identifier for the circuit where the event takes place.
 * @property {string} circuit_short_name - The abbreviated name of the circuit where the event takes place.
 * @property {string} country_code - The ISO 3166-1 alpha-2 country code representing the country where the event is held.
 * @property {number} country_key - The unique identifier for the country where the event is held.
 * @property {string} country_name - The full name of the country where the event is held.
 * @property {string} date_start - The start date of the meeting in ISO 8601 format (YYYY-MM-DD).
 * @property {string} gmt_offset - The GMT offset of the event location, represented as a string (e.g., "+02:00").
 * @property {string} location - The specific location or city where the event takes place.
 * @property {NumberOrLatest} meeting_key - The unique identifier for the meeting or the keyword "latest" for the most recent meeting.
 * @property {string} meeting_name - The short name of the meeting or event.
 * @property {string} meeting_official_name - The official full name of the meeting or event.
 * @property {number} year - The year in which the meeting or event takes place.
 */
export interface MeetingsResponse {
	circuit_key: number;
	circuit_short_name: string;
	country_code: string;
	country_key: number;
	country_name: string;
	date_start: string;
	gmt_offset: string;
	location: string;
	meeting_key: NumberOrLatest;
	meeting_name: string;
	meeting_official_name: string;
	year: number;
}

// Pit
// Example URL: https://api.openf1.org/v1/pit?session_key=9158&pit_duration<31
export interface PitRequest {
	queryParams: {
		session_key?: NumberOrLatest;
		pit_duration?: number;
	};
}

/**
 * Represents the response data for a pit stop in a racing event.
 *
 * @property date - The date of the pit stop in ISO 8601 format.
 * @property driver_number - The unique number assigned to the driver.
 * @property lap_number - The lap during which the pit stop occurred.
 * @property meeting_key - The identifier for the meeting or event, or the string "latest".
 * @property pit_duration - The duration of the pit stop in seconds.
 * @property session_key - The identifier for the session, or the string "latest".
 */
export interface PitResponse {
	date: string;
	driver_number: number;
	lap_number: number;
	meeting_key: NumberOrLatest;
	pit_duration: number;
	session_key: NumberOrLatest;
}

// Position
// Example URL: https://api.openf1.org/v1/position?meeting_key=1217&driver_number=40&position<=3
export interface PositionRequest {
	queryParams: {
		meeting_key?: NumberOrLatest;
		driver_number?: number;
		position?: number;
	};
}

/**
 * Represents the response for a driver's position in a session.
 *
 * @property date - The date of the session in ISO 8601 format.
 * @property driver_number - The unique number assigned to the driver.
 * @property meeting_key - The identifier for the meeting, which can be a specific number or the keyword "latest".
 * @property position - The position of the driver in the session.
 * @property session_key - The identifier for the session, which can be a specific number or the keyword "latest".
 */
export interface PositionResponse {
	date: string;
	driver_number: number;
	meeting_key: NumberOrLatest;
	position: number;
	session_key: NumberOrLatest;
}

// Race Control
// Example URL: https://api.openf1.org/v1/race_control?flag=BLACK AND WHITE&driver_number=1&date>=2023-01-01&date<2023-09-01
export interface RaceControlRequest {
	queryParams: {
		flag?: string;
		driver_number?: number;
		date_start?: string;
		date_end?: string;
	};
}

/**
 * Represents a response from the race control system, providing details about
 * a specific event or message during a race session.
 *
 * @interface RaceControlResponse
 * @property {string} category - The category of the message, such as "info", "warning", or "error".
 * @property {string} date - The timestamp of when the message was issued, in ISO 8601 format.
 * @property {number} driver_number - The number of the driver associated with the message, if applicable.
 * @property {string} flag - The flag status associated with the message, such as "green", "yellow", or "red".
 * @property {number} lap_number - The lap number during which the message was issued.
 * @property {NumberOrLatest} meeting_key - The unique identifier for the meeting or session, or "latest" for the most recent session.
 * @property {string} message - The content of the message issued by race control.
 * @property {string} scope - The scope of the message, indicating whether it applies to a specific driver, team, or the entire session.
 * @property {number | null} sector - The sector of the track where the event occurred, or null if not applicable.
 * @property {NumberOrLatest} session_key - The unique identifier for the session, or "latest" for the most recent session.
 */
export interface RaceControlResponse {
	category: string;
	date: string;
	driver_number: number;
	flag: string;
	lap_number: number;
	meeting_key: NumberOrLatest;
	message: string;
	scope: string;
	sector: number | null;
	session_key: NumberOrLatest;
}

// Sessions
// Example URL: https://api.openf1.org/v1/sessions?country_name=Belgium&session_name=Sprint&year=2023
export interface SessionsRequest {
	queryParams: {
		country_name?: string;
		session_name?: string;
		year?: number;
	};
}

/**
 * Represents the response structure for session data in the F1 API.
 *
 * @interface SessionsResponse
 * @property {number} circuit_key - The unique identifier for the circuit.
 * @property {string} circuit_short_name - The abbreviated name of the circuit.
 * @property {string} country_code - The ISO 3166-1 alpha-2 country code where the circuit is located.
 * @property {number} country_key - The unique identifier for the country.
 * @property {string} country_name - The full name of the country where the circuit is located.
 * @property {string} date_end - The end date of the session in ISO 8601 format.
 * @property {string} date_start - The start date of the session in ISO 8601 format.
 * @property {string} gmt_offset - The GMT offset for the session's location.
 * @property {string} location - The geographical location of the circuit.
 * @property {NumberOrLatest} meeting_key - The unique identifier for the meeting or the latest meeting indicator.
 * @property {NumberOrLatest} session_key - The unique identifier for the session or the latest session indicator.
 * @property {string} session_name - The name of the session (e.g., "Practice 1", "Qualifying").
 * @property {string} session_type - The type of session (e.g., "Practice", "Qualifying", "Race").
 * @property {number} year - The year in which the session takes place.
 */
export interface SessionsResponse {
	circuit_key: number;
	circuit_short_name: string;
	country_code: string;
	country_key: number;
	country_name: string;
	date_end: string;
	date_start: string;
	gmt_offset: string;
	location: string;
	meeting_key: NumberOrLatest;
	session_key: NumberOrLatest;
	session_name: string;
	session_type: string;
	year: number;
}

// Stints
// Example URL: https://api.openf1.org/v1/stints?session_key=9165&tyre_age_at_start>=3
export interface StintsRequest {
	queryParams: {
		session_key?: NumberOrLatest;
		tyre_age_at_start?: number;
	};
}

/**
 * Represents the response structure for stints data in a racing session.
 * This interface provides detailed information about a driver's stint during a session.
 *
 * @property compound - The type of tyre compound used during the stint (e.g., soft, medium, hard).
 * @property driver_number - The unique number assigned to the driver.
 * @property lap_end - The lap number at which the stint ended.
 * @property lap_start - The lap number at which the stint started.
 * @property meeting_key - The unique identifier for the meeting or event, or the keyword "latest".
 * @property session_key - The unique identifier for the session, or the keyword "latest".
 * @property stint_number - The sequential number of the stint for the driver in the session.
 * @property tyre_age_at_start - The age of the tyres (in laps) at the start of the stint.
 */
export interface StintsResponse {
	compound: string;
	driver_number: number;
	lap_end: number;
	lap_start: number;
	meeting_key: NumberOrLatest;
	session_key: NumberOrLatest;
	stint_number: number;
	tyre_age_at_start: number;
}

// Team Radio
// Example URL: https://api.openf1.org/v1/team_radio?session_key=9158&driver_number=11
export interface TeamRadioRequest {
	queryParams: {
		session_key?: NumberOrLatest;
		driver_number?: number;
	};
}

/**
 * Represents the response structure for a team radio recording.
 *
 * @interface TeamRadioResponse
 * @property {string} date - The date when the team radio was recorded, formatted as a string.
 * @property {number} driver_number - The unique number assigned to the driver associated with the team radio.
 * @property {NumberOrLatest} meeting_key - The identifier for the meeting or event, which can be a number or the latest event.
 * @property {string} recording_url - The URL where the team radio recording can be accessed.
 * @property {NumberOrLatest} session_key - The identifier for the session, which can be a number or the latest session.
 */
export interface TeamRadioResponse {
	date: string;
	driver_number: number;
	meeting_key: NumberOrLatest;
	recording_url: string;
	session_key: NumberOrLatest;
}

// Weather
// Example URL: https://api.openf1.org/v1/weather?meeting_key=1208&wind_direction>=130&track_temperature>=52
export interface WeatherRequest {
	queryParams: {
		meeting_key?: NumberOrLatest;
		wind_direction?: number;
		track_temperature?: number;
	};
}

/**
 * Represents the weather data response for a specific session or meeting.
 *
 * @interface WeatherResponse
 * @property air_temperature - The air temperature in degrees Celsius.
 * @property date - The date of the weather data in ISO 8601 format.
 * @property humidity - The relative humidity percentage.
 * @property meeting_key - The unique identifier for the meeting or "latest".
 * @property pressure - The atmospheric pressure in hPa (hectopascals).
 * @property rainfall - The amount of rainfall in millimeters.
 * @property session_key - The unique identifier for the session or "latest".
 * @property track_temperature - The track surface temperature in degrees Celsius.
 * @property wind_direction - The wind direction in degrees (0-360).
 * @property wind_speed - The wind speed in kilometers per hour.
 */
export interface WeatherResponse {
	air_temperature: number;
	date: string;
	humidity: number;
	meeting_key: NumberOrLatest;
	pressure: number;
	rainfall: number;
	session_key: NumberOrLatest;
	track_temperature: number;
	wind_direction: number;
	wind_speed: number;
}
