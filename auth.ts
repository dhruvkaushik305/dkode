import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "@/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

//this error is to be thrown when the payload of the request has incomplete data
class InsufficientData extends CredentialsSignin {
  message = "Insufficient data";
}

//this error is to be thrown when the passwords don't match
class NotAuthorized extends CredentialsSignin {
  message = "The email or password entered is incorrect";
}

//this error is to be thrown when the user is not found
class UserNotFound extends CredentialsSignin {
  message = "User does not exist";
}

//extending the user type to avoid typescript complaining
declare module "next-auth" {
  interface User {
    role: string;
  }
  interface Session {
    user: {
      role: string;
      id: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        id: { type: "text" },
        name: { type: "text" },
        email: { type: "email" },
        password: { type: "password" },
        createdAt: { type: "date" },
        role: { type: "text" },
        newUser: { type: "boolean" },
      },
      //the main function that checks if the user is valid
      async authorize(credentials) {
        if (credentials.newUser === undefined) throw new InsufficientData();

        //if the user has been newly created, directly return the newUser
        //newUser field is passed as a string  by the credentials function (dk why)
        //FIXME the ROLE attribute of the user is not propogated when this function is invoked.
        if (credentials.newUser == "true") {
          return {
            id: credentials.id as string,
            name: credentials.name as string,
            email: credentials.email as string,
            role: credentials.role as "STUDENT" | "TEACHER",
            createdAt: credentials.createdAt as Date,
          };
        }

        if (!credentials?.email || !credentials.password)
          throw new InsufficientData();

        const queryUser = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!queryUser) {
          throw new UserNotFound();
        }

        const authenticated = await bcrypt.compare(
          credentials.password as string,
          queryUser.password
        );
        if (!authenticated) {
          throw new NotAuthorized();
        }

        return queryUser;
      },
    }),
  ],
  callbacks: {
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      //if the user is authorized, don't allow the login and signup pages
      if (auth && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      //if the user is not authenticated, don't allow the dashboard
      else if (!auth && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
      } else {
        return NextResponse.next();
      }
    },

    async jwt({ token, user }) {
      //extending the jwt to include the user's role and id
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      //extracting the additional fields from the token into the session info
      session.user.role = token.role as "STUDENT" | "TEACHER";
      session.user.id = token.id as string;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
