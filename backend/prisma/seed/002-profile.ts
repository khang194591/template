import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const seedProfile = async () => {
  try {
    for (let i = 0; i < 10; i++) {
      await prisma.profile.create({
        data: {
          email: faker.internet.email(),
          fullName: faker.name.fullName(),
          creatorId: 1,
        },
      });
    }
  } catch (error) {}
};

seedProfile();
