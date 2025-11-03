import { PrismaClient, user_role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const passwordHash = await bcrypt.hash('1234567', 10);

  const admin = await prisma.users.upsert({
    where: { email: 'admin@deyfus.com' },
    update: {},
    create: {
      first_name: 'Admin',
      last_name: 'Principal',
      email: 'admin@deyfus.com',
      password_hash: passwordHash,
      role: user_role.admin,
    },
  });

  console.log(`Admin creado: ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
