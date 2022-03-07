# K6 with TypeScript on Docker

> Create a scenario for the k6 load testing tool using TypeScript, and run the scenario you created on K6 built on Docker.

## background

K6 can be used to easily perform load testing, but there is not much information available on templates that implement the following, so we have created this one.

- K6 with TypeScript
- K6 run on Docker
- K6 scenario with cookie

## Setup

The configuration required for the K6 scenario is defined in tests/config/config.ts.

Copy and paste configExample.ts into the file.

## How to use

```
docker compose up
yarn start
```

## Analysis

The results of the load test can be visualized with influxdb and grafana set up with docker-compose.

You can visualize vus and duration.

![img](https://i.imgur.com/tTffyvw.png)
