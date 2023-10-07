import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";

const getSession = async (req: any, res: any) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401);
  }
  res.end();
};

export default getSession;
