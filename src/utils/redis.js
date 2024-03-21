import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();
let client;

// Configuración del cliente dependiendo del entorno
if (process.env.NODE_ENV === "production") {
  client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });
} else {
  // Si no está en producción
  client = createClient({
    url: process.env.REDIS_URL,
  });
}

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

// Función para establecer un par clave-valor en Redis
export async function setKeyValue(key, value, expirationSeconds) {
  try {
    // Si se proporciona un tiempo de expiración
    if (expirationSeconds) {
      // Establece la clave-valor con el tiempo de expiración
      await client.set(key, value, { EX: expirationSeconds });
      const keyForCrontab = `${key}-crontab`;

      // Llama a la función para establecer la clave-valor para crontab
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
    // Establece la clave-valor con un tiempo de expiración de 30 días
    await client.set(key, value, { EX: 24 * 60 * 60 * 30 });
    console.log(`Key "${key}" set to "${value}" successfully.`);
  } catch (err) {
    console.error(`Error setting key "${key}":`, err);
  }
}

// Función para obtener un valor de Redis
export async function getKeyValue(key) {
  try {
    const value = await client.get(key);
    return value;
  } catch (err) {
    console.error(`Error getting key "${key}":`, err);
  }
}
