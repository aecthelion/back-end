import * as dotenv from 'dotenv'
import { configSchema, IConfig } from '@src/config/config.schema'

class Config {
  private readonly config: IConfig
  constructor() {
    const config = dotenv.config()

    if (config.error) {
      throw config.error
    }

    const validatedResult = configSchema.validate(config.parsed, {
      abortEarly: false,
      stripUnknown: true
    })

    if (validatedResult.error) {
      throw validatedResult.error
    }
    this.config = validatedResult.value
  }

  get<T extends string | number>(key: keyof IConfig): T {
    return this.config[key] as T
  }
}

export default new Config()
