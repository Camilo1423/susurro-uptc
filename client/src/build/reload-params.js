import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseRute = resolve(__dirname, "..");

const Params = JSON.parse(
  fs.readFileSync(`${baseRute}/params/params.json`, "utf8"),
);
const Routes = JSON.parse(
  fs.readFileSync(`${baseRute}/params/routes.json`, "utf8"),
);

function replaceVariablesInString(str) {
  return str.replace(
    /\{\{(.+?)\}\}/g,
    (_, varName) => process.env[varName] || "",
  );
}

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

const tmpObject = {};

tmpObject.isProd = replaceVariablesInString(Params.Encripted) === "true";
tmpObject.Api = replaceVariablesInString(Params.Api);
tmpObject.environment = process.env.ENV ?? "";

tmpObject.Routes = Routes.Routes;
tmpObject.Params = replaceApiKeyPlaceholders(Params.Params);

const newConfig = JSON.stringify(tmpObject, null, 2);
fs.writeFileSync(`${baseRute}/config/config.json`, newConfig);
