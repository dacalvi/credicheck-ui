import NextCrud, {PrismaAdapter} from "@premieroctet/next-crud";
import {PrismaClient} from "@prisma/client";

const prismaClient = new PrismaClient();
const handler = async (req: any, res: any) => {
  const nextCrudHandler = await NextCrud({
    adapter: new PrismaAdapter({
      prismaClient: prismaClient,
    }),
  });
  return nextCrudHandler(req, res);
};
export default handler;
