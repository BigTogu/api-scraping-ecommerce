import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

export async function setKeyValue(key, value, expirationSeconds) {
  try {
    if (expirationSeconds) {
      await client.set(key, value, { EX: expirationSeconds });
      const keyForCrontab = `${key}-crontab`;
      await client.set(keyForCrontab, value, { EX: 24 * 60 * 60 });
    } else {
      await client.set(key, value);
    }

    console.log(`Key "${key}" set to "${value}" successfully.`);
  } catch (err) {
    console.error(`Error setting key "${key}":`, err);
  }
}
