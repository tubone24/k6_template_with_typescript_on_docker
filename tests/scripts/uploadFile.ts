import { sleep, check, group } from "k6";
import http, { StructuredRequestBody } from "k6/http";
// import ws from "k6/ws";

const binFile = open("test.jpeg", "b");
const url = "https://httpbin.org/post";

const CONCURRENT_USERS = 30;
const SLEEP_TIME_SECOND = 1;
const STAGES = [
    { duration: "10s", target: 10 },
    { duration: "10s", target: 20 },
    { duration: "3m", target: CONCURRENT_USERS },
    { duration: "20s", target: 0 },
];

export let options = {
    stages: STAGES,
    thresholds: {
        http_req_duration: ["p(95)<1000"],
        checks: ["rate>0.95"],
    },
    summaryTrendStats: [
        "avg",
        "min",
        "med",
        "max",
        "p(90)",
        "p(95)",
        "p(99)",
        "count",
    ],
};

export default (): void => {
    group("uploadFile", () => {
        const postData: StructuredRequestBody = { file: http.file(binFile) };
        const response = http.post(url, postData);

        check(response, {
            "status is 200": r => r.status === 200,
        });
    })
    sleep(SLEEP_TIME_SECOND);
    group("downloadJpegFile", () => {
        const response = http.get("https://httpbin.org/image/jpeg");
        check(response, {
            "status is 200": r => r.status === 200,
            "file is jpeg": r => r.headers["Content-Type"] === "image/jpeg",
        });
    })
    sleep(SLEEP_TIME_SECOND)
    group("downloadPngFile", () => {
        const response = http.get("https://httpbin.org/image/png");
        check(response, {
            "status is 200": r => r.status === 200,
            "file is jpeg": r => r.headers["Content-Type"] === "image/png",
        });
    })
    // group("websocket", () => {
    //     const url = "ws://echo.websocket.org";
    //     const params = { "tags": { "my_tag": "hello" } };
    //
    //     const response = ws.connect(url, params, function (socket) {
    //         socket.on('open', function open() {
    //             console.log('connected');
    //             socket.send(Date.now().toString());
    //
    //             socket.setInterval(function timeout() {
    //                 socket.ping();
    //                 console.log("Pinging every 1sec (setInterval test)");
    //             }, 1000);
    //         });
    //
    //         socket.on("ping", function () {
    //             console.log("PING!");
    //         });
    //
    //         socket.on("pong", function () {
    //             console.log("PONG!");
    //         });
    //
    //         socket.on("pong", function () {
    //             console.log("OTHER PONG!");
    //         });
    //
    //         socket.on("message", function incoming(data) {
    //             console.log(`Roundtrip time: ${Date.now() - Number(data)} ms`);
    //             socket.setTimeout(function timeout() {
    //                 socket.send(Date.now().toString());
    //             }, 500);
    //         });
    //
    //         socket.on("close", function close() {
    //             console.log("disconnected");
    //         });
    //
    //         socket.on("error", function (e) {
    //             if (e.error() != "websocket: close sent") {
    //                 console.log("An unexpected error occurred: ", e.error());
    //             }
    //         });
    //
    //         socket.setTimeout(function () {
    //             console.log("2 seconds passed, closing the socket");
    //             socket.close();
    //         }, 2000);
    //     });
    //
    //     check(response, { "status is 101": (r) => r && r.status === 101 });
    // })
};