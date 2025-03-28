import { prisma } from "../src/prisma";

async function main() {
  const existingMainCategory = await prisma.category.findFirst({
    where: {
      name: "main"
    }
  });

  if (!existingMainCategory) {
    await prisma.category.create({
      data: {
        name: "main",
        pathName: "main",
      }
    });
    console.log('Created "main" category');
  } else {
    console.log('"main" category already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
