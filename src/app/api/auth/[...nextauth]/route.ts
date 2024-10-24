import NextAuth from "next-auth/next";

import GoogleProvider from "next-auth/providers/google";
//export const dynamic = "force-dynamic";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      //clientId: process.env.GOOGLE_CLIENT_ID as string,
      //clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      clientId: process.env.google_client_id as string,
      clientSecret: process.env.google_client_secret as string,
    }),
  ],
  secret: process.env.nextauth_secret,
});
export { handler as GET, handler as POST };
