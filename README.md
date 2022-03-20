# K6 with TypeScript on Docker

> Create a scenario for the k6 load testing tool using TypeScript, and run the scenario you created on K6 built on Docker.

## Quickstart

This repository is a public template and can be used as your own GitHub repository by following the link below.

[Create it with Template](https://github.com/tubone24/k6_template_with_typescript_on_docker/generate)

## background

K6 can be used to easily perform load testing, but there is not much information available on templates that implement the following, so we have created this one.

- K6 with TypeScript
- K6 run on Docker
- (K6 scenario with cookie auth)

## Setup

The configuration required for the K6 scenario is defined in tests/config/config.ts.

Copy and paste configExample.ts into the file.

## How to use

### Add Scenario

Describe the K6 test scenario in TypeScript and place it under `test/script`.

## Run

First, use the compose up command to start [InfluxDB](https://www.influxdata.com/) for storing k6 execution results and [Grafana](https://grafana.com/) for visualization.

Specify a test scenario file as the argument to `yarn start`. File extension is **not** required.

After the transpile is executed in TSC, it will be entered into the k6 container and the test will be executed.

```
yarn install
docker compose up -d
yarn start testFileNoExtension
```

### Result Example

```
yarn run v1.22.11
$ sh -c "webpack && docker compose run k6 run --compatibility-mode=base - < ./dist/${0}.js" httpGet
asset cookieAuthServerSession.js 5.3 KiB [emitted] (name: cookieAuthServerSession)
asset httpGet.js 2.63 KiB [emitted] (name: httpGet)
runtime modules 1.83 KiB 8 modules
orphan modules 451 bytes [orphan] 4 modules
built modules 2.52 KiB [built]
  ./tests/scripts/cookieAuthServerSession.ts + 4 modules 2.38 KiB [not cacheable] [built] [code generated]
  ./tests/scripts/httpGet.ts + 1 modules 141 bytes [not cacheable] [built] [code generated]
webpack 5.35.1 compiled successfully in 619 ms
failed to get console mode for stdin: The handle is invalid.
failed to get console mode for stdin: The handle is invalid.
failed to get console mode for stdin: The handle is invalid.

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: -
     output: InfluxDBv1 (http://influxdb:8086)

  scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
           * default: 1 iterations for each of 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)


running (00m00.9s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [ 100% ] 1 VUs  00m00.9s/10m0s  1/1 iters, 1 per VU

     data_received..................: 21 kB 24 kB/s
     data_sent......................: 519 B 574 B/s
     http_req_blocked...............: avg=734.31ms min=734.31ms med=734.31ms max=734.31ms p(90)=734.31ms p(95)=734.31ms
     http_req_connecting............: avg=161.49ms min=161.49ms med=161.49ms max=161.49ms p(90)=161.49ms p(95)=161.49ms
     http_req_duration..............: avg=169.36ms min=169.36ms med=169.36ms max=169.36ms p(90)=169.36ms p(95)=169.36ms
       { expected_response:true }...: avg=169.36ms min=169.36ms med=169.36ms max=169.36ms p(90)=169.36ms p(95)=169.36ms
     http_req_failed................: 0.00% ✓ 0        ✗ 1
     http_req_receiving.............: avg=2.71ms   min=2.71ms   med=2.71ms   max=2.71ms   p(90)=2.71ms   p(95)=2.71ms
     http_req_sending...............: avg=49µs     min=49µs     med=49µs     max=49µs     p(90)=49µs     p(95)=49µs
     http_req_tls_handshaking.......: avg=381.41ms min=381.41ms med=381.41ms max=381.41ms p(90)=381.41ms p(95)=381.41ms
     http_req_waiting...............: avg=166.6ms  min=166.6ms  med=166.6ms  max=166.6ms  p(90)=166.6ms  p(95)=166.6ms
     http_reqs......................: 1     1.105208/s
     iteration_duration.............: avg=903.84ms min=903.84ms med=903.84ms max=903.84ms p(90)=903.84ms p(95)=903.84ms
     iterations.....................: 1     1.105208/s

Done in 6.27s.

```

### Clean DB

If you want to clean up the execution result once, run the following command.

```
yarn clean:db
```

## Analysis

The results of the load test can be visualized with influxdb and grafana set up with docker-compose.

You can visualize vus and duration.

![img](https://i.imgur.com/sX5HtCG.png)
