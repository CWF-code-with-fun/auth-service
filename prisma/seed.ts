// filepath: /prisma/seed.ts
import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const users:Omit<User,"id">[] = [];
  for (let i = 0; i < 1000000; i++) {
    users.push({
      email: `user${i}@example.com`,
      password: faker.internet.password(),
      refreshToken: faker.string.uuid(),
    });
  }

  // Insert users in batches to avoid overwhelming the database
  const batchSize = 1000;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    await prisma.user.createMany({ data: batch });
    console.log(`Inserted batch ${i / batchSize + 1}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });