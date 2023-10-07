export function get_url(): string {
  const url =
    process.env.ENVIRONMENT === "production"
      ? process.env.VERCEL_URL
      : process.env.NEXT_PUBLIC_URL;
  return url as string;
}
