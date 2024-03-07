// connect to redis and seach all keys with -crontab

import { createClient } from "redis";

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();
const crontabs = await client.keys("*-crontab");
console.log(crontabs);
