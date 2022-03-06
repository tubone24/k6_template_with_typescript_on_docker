import http from 'k6/http';
import { Trend } from "k6/metrics";
import { group, sleep, check } from "k6";

let options = {
  vus: 1,
  duration: "5s",
  thresholds: {
    transaction_time: ["avg<1000"],
    http_req_duration: ["avg<2000"],
  }
};

let myTrend = new Trend("transaction_time");

let urlbase = "https://api.staging.loadimpact.com";

let thinktime1 = 0.1;
let thinktime2 = 2.0;

let username = "testuser@loadimpact.com";
let password = "testpassword";


export function v3_account_login(username, password, debug) {
  // First we login. We are not interested in performance metrics from these login transactions
  var url = urlbase + "/v3/account/login";
  var payload = { email: username, password: password };
  var res = http.post(url, JSON.stringify(payload), { headers: { "Content-Type": "application/json" } });
  if (typeof debug !== 'undefined')
    console.log("Login: status=" + String(res.status) + "  Body=" + res.body);
  return res;
};

// Exercise /login endpoint when this test case is executed
export default function() {
  group("login", function() {
    var res = v3_account_login(username, password);
    check(res, {
      "status is 200": (res) => res.status === 200,
      "content-type is application/json": (res) => res.headers['Content-Type'] === "application/json",
      "login successful": (res) => JSON.parse(res.body).hasOwnProperty('token')
    });
    myTrend.add(res.timings.duration);
    sleep(thinktime1);
  });
};
