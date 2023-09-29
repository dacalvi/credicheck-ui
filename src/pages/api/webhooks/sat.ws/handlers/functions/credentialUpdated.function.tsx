import {PrismaClient} from "@prisma/client";
import {createExtractions} from "functions/sat.ws/createExtractions";

export async function credentialUpdated(payload: any) {
  const prisma = new PrismaClient();

  const {object} = payload;

  const prospect = await prisma.client.findFirst({
    where: {
      satwsid: object.id,
    },
  });

  if (prospect) {
    await prisma.client.update({
      where: {
        id: prospect.id,
      },
      data: {
        credentials_status: object.status,
      },
    });
  }

  if (prospect) {
    const extractionsOfUser = await prisma.extraction.findMany({
      where: {
        clientId: prospect.id,
      },
    });

    if (object.status === "valid") {
      if (extractionsOfUser.length === 0) {
        await createExtractions(prospect);
      }
    }
  }
}
