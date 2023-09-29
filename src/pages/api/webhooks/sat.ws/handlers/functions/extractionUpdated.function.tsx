import {PrismaClient} from "@prisma/client";

export async function extractionUpdated(payload: any) {
  const {object} = payload;
  const prisma = new PrismaClient();
  await prisma.extraction.update({
    where: {
      uuid: object.id,
    },
    data: {
      status: object.status,
    },
  });
}
