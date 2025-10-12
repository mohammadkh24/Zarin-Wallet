export enum UserRole {
    ADMIN = 'admin',
    USER  = 'user'
}

export type UserToken = {
    accessToken : string,
    refreshToken : string 
}