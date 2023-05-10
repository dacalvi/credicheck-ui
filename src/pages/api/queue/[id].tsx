import type {NextApiRequest, NextApiResponse} from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  res.status(200).send();
  // fail: res.status(400).send();
}
