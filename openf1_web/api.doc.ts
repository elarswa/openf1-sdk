export const BASE_URL = "https://api.openf1.org/v1";

// Car Data
// Example URL: https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed>=315
export interface CarDataRequest {
	queryParams: {
		driver_number: number;
		session_key: number;
		speed?: number;
	};
}

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

export interface CarDataResponse {
	brake: number;
	date: string;
	driver_number: number;
	drs: keyof typeof DRS;
	meeting_key: number;
	n_gear: number;
	rpm: number;
	session_key: number;
	speed: number;
	throttle: number;
}

function buildCarDataUrl(request: CarDataRequest): string {
	const { driver_number, session_key, speed } = request.queryParams;
	let url = `${BASE_URL}/car_data?driver_number=${driver_number}&session_key=${session_key}`;
	if (speed !== undefined) {
		url += `&speed>=${speed}`;
	}
	return url;
}

// Drivers
// Example URL: https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158
export interface DriversRequest {
	queryParams: {
		driver_number?: number;
		session_key: number;
	};
}

export interface DriversResponse {
	broadcast_name: string;
	country_code: string;
	driver_number: number;
	first_name: string;
	full_name: string;
	headshot_url: string;
	last_name: string;
	meeting_key: number;
	name_acronym: string;
	session_key: number;
	team_colour: string;
	team_name: string;
}

export function buildDriversUrl(request: DriversRequest): string {
	const { driver_number, session_key } = request.queryParams;
	let url = `${BASE_URL}/drivers?session_key=${session_key}`;
	if (driver_number !== undefined) {
		url += `&driver_number=${driver_number}`;
	}
	return url;
}

// Intervals
// Example URL: https://api.openf1.org/v1/intervals?session_key=9165&interval<0.005
export interface IntervalsRequest {
	queryParams: {
		session_key: number;
		interval?: number;
	};
}

export interface IntervalsResponse {
	date: string; // ISO 8601 date
	driver_number: number;
	gap_to_leader: number | null;
	interval: number | null;
	meeting_key: number;
	session_key: number;
}

export function buildIntervalsUrl(request: IntervalsRequest): string {
	const { session_key, interval } = request.queryParams;
	let url = `${BASE_URL}/intervals?session_key=${session_key}`;
	if (interval !== undefined) {
		url += `&interval<${interval}`;
	}
	return url;
}

// Laps
// Example URL: https://api.openf1.org/v1/laps?session_key=9161&driver_number=63&lap_number=8
export interface LapsRequest {
	queryParams: {
		session_key: number;
		driver_number: number;
		lap_number: number;
	};
}

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
	meeting_key: number;
	segments_sector_1: number[];
	segments_sector_2: number[];
	segments_sector_3: number[];
	session_key: number;
	st_speed: number;
}

export function buildLapsUrl(request: LapsRequest): string {
	const { session_key, driver_number, lap_number } = request.queryParams;
	return `${BASE_URL}/laps?session_key=${session_key}&driver_number=${driver_number}&lap_number=${lap_number}`;
}

// Location
// Example URL: https://api.openf1.org/v1/location?session_key=9161&driver_number=81&date>2023-09-16T13:03:35.200&date<2023-09-16T13:03:35.800
export interface LocationRequest {
	queryParams: {
		session_key: number;
		driver_number: number;
		date_start: string;
		date_end: string;
	};
}

export interface LocationResponse {
	date: string;
	driver_number: number;
	meeting_key: number;
	session_key: number;
	x: number;
	y: number;
	z: number;
}

export function buildLocationUrl(request: LocationRequest): string {
	const { session_key, driver_number, date_start, date_end } =
		request.queryParams;
	return `${BASE_URL}/location?session_key=${session_key}&driver_number=${driver_number}&date>${date_start}&date<${date_end}`;
}

// Meetings
// Example URL: https://api.openf1.org/v1/meetings?year=2023&country_name=Singapore
export interface MeetingsRequest {
	queryParams: {
		year: number;
		country_name: string;
	};
}

export interface MeetingsResponse {
	circuit_key: number;
	circuit_short_name: string;
	country_code: string;
	country_key: number;
	country_name: string;
	date_start: string;
	gmt_offset: string;
	location: string;
	meeting_key: number;
	meeting_name: string;
	meeting_official_name: string;
	year: number;
}

export function buildMeetingsUrl(request: MeetingsRequest): string {
	const { year, country_name } = request.queryParams;
	return `${BASE_URL}/meetings?year=${year}&country_name=${country_name}`;
}

// Pit
// Example URL: https://api.openf1.org/v1/pit?session_key=9158&pit_duration<31
export interface PitRequest {
	queryParams: {
		session_key: number;
		pit_duration?: number;
	};
}

export interface PitResponse {
	date: string;
	driver_number: number;
	lap_number: number;
	meeting_key: number;
	pit_duration: number;
	session_key: number;
}

export function buildPitUrl(request: PitRequest): string {
	const { session_key, pit_duration } = request.queryParams;
	let url = `${BASE_URL}/pit?session_key=${session_key}`;
	if (pit_duration !== undefined) {
		url += `&pit_duration<${pit_duration}`;
	}
	return url;
}

// Position
// Example URL: https://api.openf1.org/v1/position?meeting_key=1217&driver_number=40&position<=3
export interface PositionRequest {
	queryParams: {
		meeting_key: number;
		driver_number: number;
		position?: number;
	};
}

export interface PositionResponse {
	date: string;
	driver_number: number;
	meeting_key: number;
	position: number;
	session_key: number;
}

export function buildPositionUrl(request: PositionRequest): string {
	const { meeting_key, driver_number, position } = request.queryParams;
	let url = `${BASE_URL}/position?meeting_key=${meeting_key}&driver_number=${driver_number}`;
	if (position !== undefined) {
		url += `&position<=${position}`;
	}
	return url;
}

// Race Control
// Example URL: https://api.openf1.org/v1/race_control?flag=BLACK AND WHITE&driver_number=1&date>=2023-01-01&date<2023-09-01
export interface RaceControlRequest {
	queryParams: {
		flag: string;
		driver_number: number;
		date_start: string;
		date_end: string;
	};
}

export interface RaceControlResponse {
	category: string;
	date: string;
	driver_number: number;
	flag: string;
	lap_number: number;
	meeting_key: number;
	message: string;
	scope: string;
	sector: number | null;
	session_key: number;
}

export function buildRaceControlUrl(request: RaceControlRequest): string {
	const { flag, driver_number, date_start, date_end } = request.queryParams;
	return `${BASE_URL}/race_control?flag=${flag}&driver_number=${driver_number}&date>=${date_start}&date<${date_end}`;
}

// Sessions
// Example URL: https://api.openf1.org/v1/sessions?country_name=Belgium&session_name=Sprint&year=2023
export interface SessionsRequest {
	queryParams: {
		country_name: string;
		session_name: string;
		year: number;
	};
}

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
	meeting_key: number;
	session_key: number;
	session_name: string;
	session_type: string;
	year: number;
}

export function buildSessionsUrl(request: SessionsRequest): string {
	const { country_name, session_name, year } = request.queryParams;
	return `${BASE_URL}/sessions?country_name=${country_name}&session_name=${session_name}&year=${year}`;
}

// Stints
// Example URL: https://api.openf1.org/v1/stints?session_key=9165&tyre_age_at_start>=3
export interface StintsRequest {
	queryParams: {
		session_key: number;
		tyre_age_at_start?: number;
	};
}

export interface StintsResponse {
	compound: string;
	driver_number: number;
	lap_end: number;
	lap_start: number;
	meeting_key: number;
	session_key: number;
	stint_number: number;
	tyre_age_at_start: number;
}

export function buildStintsUrl(request: StintsRequest): string {
	const { session_key, tyre_age_at_start } = request.queryParams;
	let url = `${BASE_URL}/stints?session_key=${session_key}`;
	if (tyre_age_at_start !== undefined) {
		url += `&tyre_age_at_start>=${tyre_age_at_start}`;
	}
	return url;
}

// Team Radio
// Example URL: https://api.openf1.org/v1/team_radio?session_key=9158&driver_number=11
export interface TeamRadioRequest {
	queryParams: {
		session_key: number;
		driver_number: number;
	};
}

export interface TeamRadioResponse {
	date: string;
	driver_number: number;
	meeting_key: number;
	recording_url: string;
	session_key: number;
}

export function buildTeamRadioUrl(request: TeamRadioRequest): string {
	const { session_key, driver_number } = request.queryParams;
	return `${BASE_URL}/team_radio?session_key=${session_key}&driver_number=${driver_number}`;
}

// Weather
// Example URL: https://api.openf1.org/v1/weather?meeting_key=1208&wind_direction>=130&track_temperature>=52
export interface WeatherRequest {
	queryParams: {
		meeting_key: number;
		wind_direction?: number;
		track_temperature?: number;
	};
}

export interface WeatherResponse {
	air_temperature: number;
	date: string;
	humidity: number;
	meeting_key: number;
	pressure: number;
	rainfall: number;
	session_key: number;
	track_temperature: number;
	wind_direction: number;
	wind_speed: number;
}

export function buildWeatherUrl(request: WeatherRequest): string {
	const { meeting_key, wind_direction, track_temperature } =
		request.queryParams;
	let url = `${BASE_URL}/weather?meeting_key=${meeting_key}`;
	if (wind_direction !== undefined) {
		url += `&wind_direction>=${wind_direction}`;
	}
	if (track_temperature !== undefined) {
		url += `&track_temperature>=${track_temperature}`;
	}
	return url;
}
