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
      credentials: {},
      type: "credentials",

      async authorize(credentials) {
        const {email, password} = credentials as {
          email: string;
          password: string;
        };
        // eslint-disable-next-line no-console
        console.log(process.env.NEXT_PUBLIC_URL + "/api/login");
        const response = await fetch(
          process.env.NEXT_PUBLIC_URL + "/api/login",
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
        if (data.success) {
          return data;
        } else {
          return null;
        }
      },
    }),
  ],
};
export default NextAuth(authOptions);
