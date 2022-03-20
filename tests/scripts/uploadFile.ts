import { sleep, check, group } from "k6";
import http, { StructuredRequestBody } from "k6/http";

const binFile = open("test.jpeg", "b");
const url = "https://httpbin.org/post";

const CONCURRENT_USERS = 30;
const SLEEP_TIME_SECOND = 1;
const STAGES = [
    { duration: "10s", target: 10 },
    { duration: "10s", target: 20 },
    { duration: "30m", target: CONCURRENT_USERS },
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
    group("downloadFile", () => {
        const response = http.get("https://httpbin.org/image/jpeg");
        check(response, {
            "status is 200": r => r.status === 200,
            "file is jpeg": r => r.headers["Content-Type"] === "image/jpeg",
        });
    })
};