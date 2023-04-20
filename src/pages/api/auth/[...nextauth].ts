import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {},
      type: "credentials",

      async authorize(credentials) {
        // eslint-disable-next-line no-console
        console.log(process.env.VERCEL_URL);
        const {email, password} = credentials as {
          email: string;
          password: string;
        };

        // Add logic to validate credentials using login endpoint
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const data = await response.json();
        // eslint-disable-next-line no-console
        console.log(data);
        if (data.success) {
          return data;
        } else {
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
