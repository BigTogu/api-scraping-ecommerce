import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();
let client;

if (process.env.NODE_ENV === "production") {
  client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });
} else {
  client = createClient({
    url: process.env.REDIS_URL,
  });
}

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

export async function setKeyValue(key, value, expirationSeconds) {
  try {
    if (expirationSeconds) {
      await client.set(key, value, { EX: expirationSeconds });
      const keyForCrontab = `${key}-crontab`;
      await setKeyValueCrontab(keyForCrontab, value);
    } else {
      await client.set(key, value);
    }

    console.log(`Key "${key}" set to "${value}" successfully.`);
  } catch (err) {
    console.error(`Error setting key "${key}":`, err);
  }
}

export async function setKeyValueCrontab(key, value) {
  try {
    await client.set(key, value, { EX: 24 * 60 * 60 * 30 });
    console.log(`Key "${key}" set to "${value}" successfully.`);
  } catch (err) {
    console.error(`Error setting key "${key}":`, err);
  }
}

export async function getKeyValue(key) {
  try {
    const value = await client.get(key);
    return value;
  } catch (err) {
    console.error(`Error getting key "${key}":`, err);
  }
}
