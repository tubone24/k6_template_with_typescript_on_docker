import { Options } from "k6/options"
interface Admin {
  username: string
  password: string
}

interface Config {
  admin: Admin
  urlbase: string
  options: Options
}
const options: Options = {
  vus: 10,
  duration: "5s",
  thresholds: {
    transaction_time: ["avg<1000"],
    http_req_duration: ["avg<2000"],
  }
};

export const config: Config = {
  admin: {
    username: "tubone@example.com",
    password: "password",
  },
  urlbase: "https://example.com",
  options
};
