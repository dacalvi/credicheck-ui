import axios from "axios";

export const sendMail = async (to: string, subject: string, text: string) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_PROTOCOL +
      "://" +
      process.env.NEXT_PUBLIC_VERCEL_URL +
      "/api/mail",
    {
      to,
      subject,
      text,
    }
  );
  return response;
};
