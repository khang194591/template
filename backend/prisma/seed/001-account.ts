import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

const seedAccount = async () => {
  try {
    // Create Super admin account
    const adminAccount = await prisma.account.create({
      data: {
        email: process.env.SUPER_ADMIN_ACCOUNT,
        password: hashSync(process.env.SUPER_ADMIN_PASSWORD, genSaltSync(10)),
      },
    });
    await prisma.profile.create({
      data: {
        email: adminAccount.email,
        accountId: adminAccount.id,
        fullName: 'Admin',
        isActive: true,
      },
    });

    // Create normal account
    const account = await prisma.account.create({
      data: {
        email: 'default@default.com',
        password: hashSync('default', genSaltSync(10)),
      },
    });
    await prisma.profile.create({
      data: {
        email: account.email,
        accountId: account.id,
        fullName: 'Default',
        isActive: true,
      },
    });
  } catch (error) {}
};

seedAccount();
