// import { safeStringify } from "./json";
// import { ITokenOption, TokenService } from "./token";
// import { IProfile } from "./types";

export enum SupportLanguages {
  EN = "EN",
  VI = "VI",
}

export enum AppEnum {
  profile = "profile",
  LANG = "LANG",
}

const DEFAULT_LANGUAGE = SupportLanguages.EN;

// class AppService {
//   constructor(private storage: Storage, private tokenService: TokenService) {}

//   get currentAppLanguage() {
//     return this.language ? this.language : DEFAULT_LANGUAGE;
//   }

//   get profile() {
//     return this.storage.getFromKey(AppEnum.profile);
//   }
//   set profile(profile: IProfile | undefined) {
//     this.storage.setLocalStorage(
//       AppEnum.profile,
//       profile ? safeStringify(profile) : ""
//     );
//   }

//   get language() {
//     return this.storage.getLocalStorage(AppEnum.LANG) as SupportLanguages;
//   }
//   set language(value: SupportLanguages) {
//     this.storage.setLocalStorage(AppEnum.LANG, value);
//   }

//   get token(): ITokenOption {
//     const {
//       accessToken,
//       accessTokenExpiredAt,
//       refreshToken,
//       refreshTokenExpiredAt,
//     } = this.tokenService;
//     return {
//       accessToken,
//       accessTokenExpiredAt,
//       refreshToken,
//       refreshTokenExpiredAt,
//     };
//   }

//   set token(option: ITokenOption) {
//     this.tokenService.accessToken = option.accessToken;
//     this.tokenService.accessTokenExpiredAt = option.accessTokenExpiredAt;
//     this.tokenService.refreshToken = option.refreshToken;
//     this.tokenService.refreshTokenExpiredAt = option.refreshTokenExpiredAt;
//   }

//   resetAll() {
//     this.profile = undefined;
//     this.language = DEFAULT_LANGUAGE;
//     this.tokenService.resetAll();
//   }
// }

// const appService = new AppService(new Storage(), new TokenService());

// export { appService };
