# OpenF1 API Wrapper

This project is a TypeScript wrapper around `axios` for interacting with the OpenF1 API at [https://openf1.org/](https://openf1.org/). The OpenF1 API provides real-time and historical Formula 1 data, including telemetry, lap timings, driver information, and more. This wrapper simplifies making requests to the API by providing strongly-typed request and response interfaces for each endpoint.

## Features

- Simplified API interaction using `OpenF1Request`.
- Strongly-typed request and response interfaces for all endpoints.
- Supports all OpenF1 API endpoints, including car data, drivers, intervals, laps, and more.


## Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

## Usage

### Importing the Wrapper

```typescript
import OpenF1Request from "openf1-sdk";
```

### Examples

#### Fetching Car Data

The `/car_data` endpoint provides telemetry data for a specific car during a session.

```typescript
import OpenF1Request from "openf1-sdk";

const fetchCarData = async () => {
  const response = await OpenF1Request("/car_data", {
    queryParams: {
      driver_number: 55,
      session_key: "latest",
      speed: 315,
    },
  });

  console.log(response.data);
};

fetchCarData();
```

#### Fetching Driver Information

The `/drivers` endpoint provides information about drivers in a session.

```typescript
import OpenF1Request from "openf1-sdk";

const fetchDrivers = async () => {
  const response = await OpenF1Request("/drivers", {
    queryParams: {
      driver_number: 1,
      session_key: 9158,
    },
  });

  console.log(response.data);
};

fetchDrivers();
```

#### Fetching Lap Data

The `/laps` endpoint provides detailed lap data for a driver in a session.

```typescript
import OpenF1Request from "openf1-sdk";

const fetchLapData = async () => {
  const response = await OpenF1Request("/laps", {
    queryParams: {
      session_key: 9161,
      driver_number: 63,
      lap_number: 8,
    },
  });

  console.log(response.data);
};

fetchLapData();
```

#### Fetching Weather Data

The `/weather` endpoint provides weather information for a session or meeting.

```typescript
import OpenF1Request from "openf1-sdk";

const fetchWeatherData = async () => {
  const response = await OpenF1Request("/weather", {
    queryParams: {
      meeting_key: 1208,
      wind_direction: 130,
      track_temperature: 52,
    },
  });

  console.log(response.data);
};

fetchWeatherData();
```

## Supported Endpoints

- `/car_data`
- `/drivers`
- `/intervals`
- `/laps`
- `/location`
- `/meetings`
- `/pit`
- `/position`
- `/race_control`
- `/sessions`
- `/stints`
- `/team_radio`
- `/weather`


