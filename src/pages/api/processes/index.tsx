import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const processes = await getProcesses();
    return res.status(200).json({processes, success: true});
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function getProcesses() {
  const processes = await prisma.process.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      client: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return processes;
}
