import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "@/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

class InsufficientData extends CredentialsSignin {
  message = "Insufficient data";
}

class NotAuthorized extends CredentialsSignin {
  message = "The email or password entered is incorrect";
}

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
        if (credentials.newUser === undefined)
          //newUser flag must be present
          throw new InsufficientData();

        //if the user has been newly created, directly return the newUser
        if (credentials.newUser == "true") {
          //newUser is interpreted as a string in this function
          return {
            id: credentials.id as string,
            name: credentials.name as string,
            email: credentials.email as string,
            role: credentials.role as "STUDENT" | "TEACHER",
            createdAt: credentials.createdAt as Date,
          };
        }

        //if the user is not new, check if the credentials are valid
        if (!credentials || !credentials.email || !credentials.password)
          throw new InsufficientData();

        //check if the user exists
        const queryUser = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        //if the user doesn't exist, throw an error
        if (!queryUser) {
          throw new UserNotFound();
        }

        //if the user exists, check if the password is correct
        const authenticated = await bcrypt.compare(
          credentials.password as string,
          queryUser.password,
        );
        if (!authenticated) {
          throw new NotAuthorized();
        }

        //if the password is correct
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
