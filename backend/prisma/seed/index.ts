import { PrismaClient } from '@prisma/client';
import { hashSync, genSaltSync } from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const seedAccount = async () => {
  try {
    const adminAccount = await prisma.account.create({
      data: {
        email: 'admin@admin.com',
        password: hashSync('123456', genSaltSync(10)),
      },
    });

    const adminProfile = await prisma.profile.create({
      data: {
        email: adminAccount.email,
        accountId: adminAccount.id,
        fullName: 'Admin',
        isActive: true,
      },
    });

    for (let i = 0; i < 10; i++) {
      await prisma.profile.create({
        data: {
          email: faker.internet.email(),
          fullName: faker.name.fullName(),
          creatorId: adminProfile.id,
        },
      });
    }
  } catch (error) {}
};

seedAccount();
