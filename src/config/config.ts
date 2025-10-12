import { ConfigModule, registerAs } from "@nestjs/config";

export enum configKeys {
    App='app',
    Db='db',
    Pay='pay'
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

export const configurations = [appConfig , dbConfig , payConfig]