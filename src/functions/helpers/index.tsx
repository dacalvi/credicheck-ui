export function get_url(): string {
  const url =
    process.env.NEXT_PUBLIC_PROTOCOL +
    "://" +
    process.env.NEXT_PUBLIC_VERCEL_URL;
  return url as string;
}
