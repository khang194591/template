import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { IBaseQueryString } from 'src/common/interfaces';
import { DatabaseService } from 'src/common/services/database.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly db: DatabaseService) {}

  async getAll(query: IBaseQueryString): Promise<Profile[]> {
    try {
      const { take = 5, skip = 0 } = query;
      const results = await this.db.profile.findMany({
        take,
        skip,
        include: {
          roles: true,
        },
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
        include: { roles: true },
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateProfileDto): Promise<Profile> {
    try {
      const { roles, ...restData } = data;
      const roleNames = roles.map((item) => ({ name: item }));
      const newItem = await this.db.profile.create({
        data: {
          ...restData,
          roles: {
            connect: roleNames,
          },
        },
        include: {
          roles: true,
        },
      });
      const newItemId = newItem.id;
      if (newItemId) {
        return newItem;
      }
      throw new InternalServerErrorException();
    } catch (error) {
      throw error;
    }
  }

  async updateById(id: number, data: UpdateProfileDto) {
    try {
      const { roles, ...restData } = data;
      const roleNames = roles.map((item) => ({ name: item }));
      const updateItem = await this.db.profile.update({
        where: { id },
        data: {
          ...restData,
          roles: {
            connect: roleNames,
          },
        },
        include: {
          roles: true,
        },
      });
      return updateItem;
    } catch (error) {}
  }

  async deleteById(id: number) {
    try {
      const deleteItem = await this.db.profile.delete({ where: { id } });
      return deleteItem;
    } catch (error) {
      throw error;
    }
  }
}
