import {DefaultSession} from "next-auth";

// nextauth.d.ts
export enum Role {
  superAdmin = 1,
}

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roleId?: number;
    companyId?: string;
    companyName?: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roleId?: number;
    companyId?: string;
    companyName?: string;
  }
}
