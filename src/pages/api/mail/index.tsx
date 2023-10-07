import axios from "axios";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    return await sendMail(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function sendMail(req: any, res: any) {
  const data = req.body;

  const fetchUrl = `https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send`;

  const headers = {
    "content-type": "application/json",
    "X-RapidAPI-Key": "ae3472024fmshd62763277d5eb85p1c1d99jsn03e4274f192b",
    "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
  };

  const payload = {
    personalizations: [
      {
        to: [
          {
            email: data.to,
          },
        ],
        subject: data.subject,
      },
    ],
    from: {
      email: "from_address@example.com",
    },
    content: [
      {
        type: "text/html",
        value: data.text,
      },
    ],
  };

  try {
    await axios.post(fetchUrl, payload, {headers});
    // TODO: Evaluate response and response accordingly
    return res.status(200).json({message: "Success", success: true});
  } catch (error) {
    return res.status(500).json({message: "Error", success: false});
  }
}
