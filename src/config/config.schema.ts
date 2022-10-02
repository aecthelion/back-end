import Joi from "joi";

export interface IConfig {
  MODE_ENV: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string | number;
  PORT: number;
  LOGGER_LVL: string;
  MAX_LOG_FILES: string;
  LOGS_PATH: string;
}

/* error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6  */

export const configSchema = Joi.object<IConfig>({
  MODE_ENV: Joi.string()
    .valid("production", "development", "test")
    .default("development"),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.alternatives([Joi.string(), Joi.number()]).default(
    "1y"
  ),
  PORT: Joi.number().default(8000),
  LOGGER_LVL: Joi.string()
    .valid("error", "warn", "info", "http", "verbose", "debug", "silly")
    .default("info"),
  MAX_LOG_FILES: Joi.string().default("30d"),
  LOGS_PATH: Joi.string().default("."),
});
