import { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      //clientId: process.env.GOOGLE_CLIENT_ID as string,
      //clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      clientId: process.env.google_client_id as string,
      clientSecret: process.env.google_client_secret as string,
    }),
  ],
};
