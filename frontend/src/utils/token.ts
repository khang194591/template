import { storage } from "./storage";

const BUFFER_TIME = 60 * 1000; // 60s

export const enum TokenEnum {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  ACCESS_TOKEN_EXPIRED_AT = "ACCESS_TOKEN_EXPIRED_AT",

  REFRESH_TOKEN = "REFRESH_TOKEN",
  REFRESH_TOKEN_EXPIRE_AT = "REFRESH_TOKEN_EXPIRE_AT",
}

export interface ITokenOption {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAt: number;
  refreshTokenExpiredAt: number;
}

export class TokenService {
  get accessToken() {
    return storage.getLocalStorage(TokenEnum.ACCESS_TOKEN);
  }
  set accessToken(value: string) {
    storage.setLocalStorage(TokenEnum.ACCESS_TOKEN, value);
  }

  get refreshToken() {
    return storage.getLocalStorage(TokenEnum.REFRESH_TOKEN);
  }
  set refreshToken(value: string) {
    storage.setLocalStorage(TokenEnum.REFRESH_TOKEN, value);
  }

  get accessTokenExpiredAt() {
    return +storage.getLocalStorage(TokenEnum.ACCESS_TOKEN_EXPIRED_AT);
  }
  set accessTokenExpiredAt(expiredIn: number) {
    const expiredAt = new Date().getTime() + expiredIn * 1000 - BUFFER_TIME;
    storage.setLocalStorage(
      TokenEnum.ACCESS_TOKEN_EXPIRED_AT,
      String(expiredAt)
    );
  }

  get refreshTokenExpiredAt() {
    return +storage.getLocalStorage(TokenEnum.REFRESH_TOKEN_EXPIRE_AT);
  }
  set refreshTokenExpiredAt(expiredIn: number) {
    const expiredAt = new Date().getTime() + expiredIn * 1000 - BUFFER_TIME;
    storage.setLocalStorage(
      TokenEnum.REFRESH_TOKEN_EXPIRE_AT,
      String(expiredAt)
    );
  }

  resetAccessToken(): void {
    storage.setLocalStorage(TokenEnum.ACCESS_TOKEN, "");
  }

  resetRefreshToken(): void {
    storage.setLocalStorage(TokenEnum.REFRESH_TOKEN, "");
  }

  resetAccessTokenExpiredAt(): void {
    storage.setLocalStorage(TokenEnum.ACCESS_TOKEN_EXPIRED_AT, "");
  }

  resetRefreshTokenExpiredAt(): void {
    storage.setLocalStorage(TokenEnum.REFRESH_TOKEN_EXPIRE_AT, "");
  }

  resetAll(): void {
    this.resetAccessToken();
    this.resetAccessTokenExpiredAt();
    this.resetRefreshToken();
    this.resetRefreshTokenExpiredAt();
  }
}

export const tokenService = new TokenService();
