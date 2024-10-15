"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import NextAuth from "next-auth/next";
import Image from "next/image";
//import { getSheetsData } from "./_lib/readSheet";

//export default function Home() {
const Home = () => {
  const { data: session, status } = useSession();
  //var name="<unknown>";
  //var email="<unknown>";

  //const sheetsdata = getSheetsData();
  //console.log(sheetsdata);
  //let session = { user: { name: "<unknown>", email: "<unknown>" } };
  if (session) {
    var name = session!.user!.name ? session!.user!.name : "<unknown>";
    var email = session!.user!.name ? session!.user!.email : "<unknown>";
  }
  //const { name, email, image } = session.user;
  return (
    <>
      {session ? (
        <>
          <main className="text-center pt-32 px-5">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 ">
              welcome to main page
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 ">
              {name!}, {email!}
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consectetur quos dolore quam blanditiis dignissimos asperiores
              quae hic culpa reiciendis ipsam perspiciatis mollitia, quis amet
              officia, quidem quia, quo aliquid repellendus.
            </p>
          </main>
          <div>
            <h1 className="text-3xl text-red-500 font-bold">You logged in.</h1>
            <button
              onClick={() => signOut()}
              className="border border-black rounded-lg"
            >
              Sign out
            </button>
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-3xl text-red-500 font-bold">
            You are not logged in
          </h1>
          <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In</h1>

          <button
            onClick={() => signIn("google")}
            className="border border-black rounded-lg"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </>
  );
};

export default Home;
