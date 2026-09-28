import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseRute = resolve(__dirname, "..");

const configPath = `${baseRute}/config/config.json`;
const configDir = `${baseRute}/config`;

if (!fs.existsSync(configDir)) {
  console.log("Creating config directory...");
  fs.mkdirSync(configDir, { recursive: true });
}

if (!fs.existsSync(configPath)) {
  console.log("config file not found. Creating config.json empty...");
  fs.writeFileSync(configPath, JSON.stringify({}), "utf8");
}

const Params = JSON.parse(
  fs.readFileSync(`${baseRute}/params/params.json`, "utf8"),
);
const Routes = JSON.parse(
  fs.readFileSync(`${baseRute}/params/routes.json`, "utf8"),
);

// Reemplaza los placeholders {{VAR}} de un objeto (solo primer nivel de valores
// string) por el valor de la variable de entorno correspondiente.
function replaceApiKeyPlaceholders(apiKeys) {
  const replacedKeys = {};
  for (const [service, value] of Object.entries(apiKeys)) {
    if (typeof value !== "string") {
      replacedKeys[service] = value;
      continue;
    }
    const placeholderMatch = value.match(/\{\{(.+?)\}\}/);
    if (placeholderMatch) {
      const envVarName = placeholderMatch[1];
      replacedKeys[service] = process.env[envVarName] || value;
    } else {
      replacedKeys[service] = value;
    }
  }
  return replacedKeys;
}

// Reemplaza todos los {{VAR}} dentro de un string por sus variables de entorno.
function replaceVariablesInString(str) {
  return str.replace(
    /\{\{(.+?)\}\}/g,
    (_, varName) => process.env[varName] || "",
  );
}

const tmpObject = {};

tmpObject.isProd = replaceVariablesInString(Params.Encripted) === "true";
tmpObject.Api = replaceVariablesInString(Params.Api);
tmpObject.environment = process.env.ENV ?? "";

// Las rutas se copian tal cual (el gestor de rutas del back). Los params sí
// resuelven sus placeholders (p. ej. claves de servicios externos).
tmpObject.Routes = Routes.Routes;
tmpObject.Params = replaceApiKeyPlaceholders(Params.Params);

const newConfig = JSON.stringify(tmpObject, null, 2);
fs.writeFileSync(`${baseRute}/config/config.json`, newConfig);

console.log(`📝 config.json updated`);
