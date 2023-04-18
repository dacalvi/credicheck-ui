import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";

const getSession = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    // eslint-disable-next-line no-console
    console.log("Session", JSON.stringify(session, null, 2));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};

export default getSession;
