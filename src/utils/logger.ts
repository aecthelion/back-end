import winston from 'winston'
import config from '@src/config'
import 'winston-daily-rotate-file'
const dailyRotateInfoTransport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  dirname: config.get<string>('LOGS_PATH'),
  maxFiles: config.get<string>('MAX_LOG_FILES'),
  level: 'info'
})
const dailyRotateErrorTransport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  dirname: config.get<string>('LOGS_PATH'),
  maxFiles: config.get<string>('MAX_LOG_FILES'),
  level: 'error'
})
const {
  label,
  timestamp,
  combine,
  printf,
  colorize,
  splat,
  errors,
  json
} = winston.format
const messageFormatter = printf(info => {
  // If we're trying to log an error, it would have stack and message properties. However, stack property also
  // includes error message along with call stack. So, we can use this as a message, and discard the actual
  // message property
  const message = info.stack || info.message
  // Checking the type of logged message. If it's an object - perform JSON stringification to display it correctly.
  // Otherwise - just print the message. In that way we're getting rid of unnecessary quotation marks for strings
  return `${info.timestamp} ${info.label} [${info.level}]: ${
    typeof message === 'object'
      ? '\n' + JSON.stringify(message, null, 2)
      : message
  }`
})
const consoleMessageFormat = (loggerLabel: string) =>
  combine(
    errors({ stack: true }),
    timestamp(),
    colorize(),
    splat(), // splat formatter allows us to use format specifiers such as %s, %d, %f, %o
    label({ label: loggerLabel }),
    messageFormatter
  )
const commonFormat = (loggerLabel: string) =>
  combine(
    errors({ stack: true }),
    timestamp(),
    splat(),
    label({ label: loggerLabel }),
    json()
  )
export const createLogger = (loggerLabel = 'APPLICATION') =>
  winston.createLogger({
    level: config.get<string>('LOGGER_LVL'),
    format: commonFormat(loggerLabel),
    transports: [
      new winston.transports.Console({
        format: consoleMessageFormat(loggerLabel)
      }),
      dailyRotateInfoTransport,
      dailyRotateErrorTransport
    ]
  })

const format = combine(
  label({ label: 'APPLICATION' }),
  timestamp(),
  colorize(),
  splat(),
  messageFormatter
)

export const logger = winston.createLogger({
  level: config.get<string>('LOGGER_LVL'),
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format }),
    dailyRotateInfoTransport,
    dailyRotateErrorTransport
  ]
})
