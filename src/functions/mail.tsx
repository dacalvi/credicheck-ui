export const sendMail = async (to: string, subject: string, text: string) => {
  const axios = require("axios");
  const options = {
    method: "POST",
    url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "ae3472024fmshd62763277d5eb85p1c1d99jsn03e4274f192b",
      "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
    },
    data: {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          subject: subject,
        },
      ],
      from: {
        email: "info@credicheck.com",
      },
      content: [
        {
          type: "text/plain",
          value: text,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
