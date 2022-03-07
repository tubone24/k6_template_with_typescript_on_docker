import http from "k6/http";
import {Trend} from "k6/metrics";
import {check, group, sleep} from "k6";

import { config } from "../config/config"

export const options = config.options;

const urlbase = config.urlbase;

const myTrend = new Trend("transaction_time");
const sleepTime = 0.1;
const username = config.admin.username;
const password = config.admin.password;


const account_login = (username: string, password: string) => {
  const url = urlbase + "/login";
  const payload = { email: username, password: password, errors: [] };
  return http.post(url, JSON.stringify(payload), {headers: {"Content-Type": "application/json"}});
};

let cookie: string | null = null;

export const setup = () => {
  const res = account_login(username, password);
  check(res, {
    "status is ok": (res) => res.status < 400,
    "content-type is application/json": (res) => res.headers['Content-Type'] === "application/json; charset=utf-8",
    "login successful": (res) => res.headers.hasOwnProperty('Set-Cookie')
  });
  sleep(sleepTime);
  if (res.status < 400) {
    cookie = res.headers["Set-Cookie"];
  }
};

export default function() {
  group("check", () => {
    const url = urlbase + "/check";
    const params = {
      headers: {
        cookie: cookie || ""
      }
    };
    const res = http.get(url, params);
    check(res, {
      "status is ok": (res) => res.status < 400,
      "content-type is application/json": (res) => res.headers['Content-Type'] === "application/json; charset=utf-8",
      "login check": (res) => typeof res.body === "string" ? JSON.parse(res.body)["email"] === username : false
    });
    myTrend.add(res.timings.duration);
    sleep(sleepTime);
  });
};
