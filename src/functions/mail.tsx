import axios from "axios";

export const sendMail = async (to: string, subject: string, text: string) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/mail", {
    to,
    subject,
    text,
  });
  return response;
};
