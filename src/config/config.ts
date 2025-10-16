import { ConfigModule, registerAs } from "@nestjs/config";

export enum configKeys {
    App='app',
    Db='db',
    Pay='pay',
    Jwt = 'jwt',
    Sms = 'sms'
}

export const appConfig = registerAs(configKeys.App , () => ({
    port : Number(process.env.PORT) || 3000
}))

export const dbConfig = registerAs(configKeys.Db , () => ({
    port: Number(process.env.DB_PORT) || 5432,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME,
}))

export const payConfig = registerAs(configKeys.Pay , () => ({
    merchant_id : process.env.ZARINPAL_MERCHANT_ID,
    callback_url : process.env.ZARINPAL_CALLBACK_URL
}))

export const JwtConfig = registerAs(configKeys.Jwt, () => ({
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  }));

export const SmsConfig = registerAs(configKeys.Sms, () => ({
    SMS_USERNAME: process.env.SMS_USERNAME,
    SMS_PASSWORD: process.env.SMS_PASSWORD,
    SMS_FROM: process.env.SMS_FROM,
    VERIFY_PATTERN_CODE: process.env.VERIFY_PATTERN_CODE,
    API_KEY:process.env.API_KEY
  }));

export const configurations = [appConfig , dbConfig , payConfig , JwtConfig , SmsConfig]