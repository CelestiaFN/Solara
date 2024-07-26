import { z } from "zod";
import { resolve } from "node:path";
import dotenv from "dotenv";
import logger from "../../utils/logger/logger";
import { ConfigSchema } from "./schema/environment";

export default class EnvBuilder {
  private static validatedConfig: z.infer<typeof ConfigSchema>;
  public static config: z.infer<typeof ConfigSchema>;

  public static Validate(): z.infer<typeof ConfigSchema> {
    dotenv.config({ path: resolve(process.cwd(), ".env") });

    const PORT = parseInt(Bun.env.PORT as string, 10);
    const BOT_TOKEN = Bun.env.BOT_TOKEN
    const JWTSECRET = Bun.env.JWTSECRET
    const MAINTENANCE = Bun.env.MAINTENANCE
    const PUBLICVER = Bun.env.PUBLICVER
    const SEASON = Bun.env.SEASON
    const WL = Bun.env.WL
    const EMERGENCY_NOTICE_TITLE = Bun.env.EMERGENCY_NOTICE_TITLE
    const EMERGENCY_NOTICE_BODY = Bun.env.EMERGENCY_NOTICE_BODY
    const DB_URL = Bun.env.DB_URL
    const SERVICETYPE = Bun.env.SERVICETYPE
    const MMIP = Bun.env.MMIP
    const LYRASECURE = Bun.env.LYRASECURE
    const ElixionIP = Bun.env.ElixionIP

    const unsafeConfig = ConfigSchema.safeParse({
      PORT,
      JWTSECRET,
      ElixionIP,
      DB_URL,
      MAINTENANCE,
      PUBLICVER,
      SEASON,
      WL,
      BOT_TOKEN,
      EMERGENCY_NOTICE_TITLE,
      EMERGENCY_NOTICE_BODY,
      SERVICETYPE,
      MMIP,
      LYRASECURE
    });

    if (!unsafeConfig.success) throw new Error(unsafeConfig.error.message);

    this.validatedConfig = unsafeConfig.data;

    return unsafeConfig.data;
  }

  public static Register(): z.infer<typeof ConfigSchema> {
    this.Validate();

    logger.startup("Environment validated!");
    this.config = this.validatedConfig;
    return this.config;
  }
}