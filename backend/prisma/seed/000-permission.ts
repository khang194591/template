import {
  PermissionAction,
  PermissionResource,
  PrismaClient,
} from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const seedPermission = async () => {
  const resoures = Object.values(PermissionResource);
  const actions = Object.values(PermissionAction);
  const permissions: any[] = [];

  resoures.map((resource: PermissionResource) => {
    actions.map((action: PermissionAction) => {
      permissions.push({
        action,
        resource,
      });
    });
  });

  try {
    const result = await prisma.permission.createMany({ data: permissions });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

seedPermission();
