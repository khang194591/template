import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { IBaseQueryString } from 'src/common/interfaces';
import { DatabaseService } from 'src/common/services/database.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly db: DatabaseService) {}

  async getAll(query: IBaseQueryString): Promise<Profile[]> {
    try {
      const { take = 5, skip = 0 } = query;
      const results = await this.db.profile.findMany({
        take,
        skip,
      });
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<Profile> {
    try {
      const profile = await this.db.profile.findUnique({
        where: { id },
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async create(profile: CreateProfileDto): Promise<Profile> {
    try {
      const newProfile = await this.db.profile.create({ data: profile });
      const profileId = newProfile.id;
      if (profileId) {
        return await this.getById(profileId);
      }
      throw new InternalServerErrorException();
    } catch (error) {
      throw error;
    }
  }
}
