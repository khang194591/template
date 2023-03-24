import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Account, Profile } from '@prisma/client';
import EnvKey from 'src/common/configs/env';
import { generateHashToken } from 'src/common/helpers/common.function';
import { DatabaseService } from 'src/common/services/database.service';

export interface IToken {
  token: string;
  expiredIn: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService,
  ) {}

  async getByEmail(email: string): Promise<Account | null> {
    try {
      const account = await this.db.account.findUnique({ where: { email } });
      return account;
    } catch (error) {
      throw error;
    }
  }

  async login(
    email: string,
  ): Promise<{ profile: Profile; accessToken: IToken; refreshToken: IToken }> {
    try {
      const profile = await this.db.profile.findUnique({
        where: { email },
        include: {
          roles: true,
        },
      });
      const accessToken = this.generateAccessToken(profile);
      const hashToken = generateHashToken(profile.id);
      const refreshToken = this.generateRefreshToken(profile, hashToken);

      // Logout other logging user
      try {
        await this.db.token.delete({ where: { profileId: profile.id } });
      } catch (error) {}

      await this.db.token.create({
        data: {
          token: refreshToken.token,
          hashToken,
          profileId: profile.id,
        },
      });

      return { profile, accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout(profile: Profile) {
    try {
      await this.db.token.delete({ where: { profileId: profile.id } });
      return true;
    } catch (error) {
      throw error;
    }
  }

  private generateAccessToken(profile: Profile): IToken {
    const accessTokenExpiredIn = this.configService.get(
      EnvKey.ACCESS_TOKEN_EXPIRED_IN,
    );
    const secretAccessTokenKey = this.configService.get(
      EnvKey.ACCESS_TOKEN_KEY,
    );
    const accessTokenOptions: JwtSignOptions = {
      secret: secretAccessTokenKey,
      expiresIn: accessTokenExpiredIn,
    };
    const payloadAccessToken = {
      ...profile,
      expiresIn: accessTokenExpiredIn,
    };
    const accessToken = this.jwtService.sign(
      payloadAccessToken,
      accessTokenOptions,
    );

    return {
      token: accessToken,
      expiredIn: accessTokenExpiredIn,
    };
  }

  private generateRefreshToken(profile: Profile, hashToken: string): IToken {
    const refreshTokenExpiredIn = this.configService.get(
      EnvKey.REFRESH_TOKEN_EXPIRED_IN,
    );
    const secretRefreshTokenKey = this.configService.get(
      EnvKey.REFRESH_TOKEN_KEY,
    );
    const refreshTokenOptions: JwtSignOptions = {
      secret: secretRefreshTokenKey,
      expiresIn: refreshTokenExpiredIn,
    };

    const payloadRefreshToken = {
      ...profile,
      expiresIn: refreshTokenExpiredIn,
      hashToken,
    };
    const refreshToken = this.jwtService.sign(
      payloadRefreshToken,
      refreshTokenOptions,
    );
    return {
      token: refreshToken,
      expiredIn: refreshTokenExpiredIn,
    };
  }
}
