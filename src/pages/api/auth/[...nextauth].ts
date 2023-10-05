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
        const response = await fetch(process.env.VERCEL_URL + "/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();
        if (data.success) {
          delete data.success;
          return data;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.roleId = user.roleId;
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.companyId = user.companyId;
        token.companyName = user.companyName;
      }
      return token;
    },
    session({session, token}) {
      if (token && session.user) {
        session.user.roleId = token.roleId;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.companyId = token.companyId;
        session.user.companyName = token.companyName;

        //calculate gravatar image from email and save it to session
        const hash = require("crypto")
          .createHash("md5")
          .update(session.user.email)
          .digest("hex");
        session.user.image = `https://www.gravatar.com/avatar/${hash}`;
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
