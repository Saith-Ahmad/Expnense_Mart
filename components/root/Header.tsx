"use client";
import React from "react";
import { dark } from '@clerk/themes'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-5 flex justify-between items-center border-none shadow-sm bg-black bg-opacity-30 backdrop-blur-lg">
      <div className="flex flex-row items-center">
        <Image src={"/logo.png"} alt="logo" width={120} height={120} />
      </div>
      {isSignedIn ? (
        <div className="text-white flex items-center gap-3">
          <UserButton appearance={{baseTheme:dark}}/>
          <div className="stats_card p-1 px-2 rounded-lg">
            <SignOutButton />
          </div>
          <Link href={"/dashboard"}>
            <Button className="rounded-full btn_class hover:bg-secondaryhover">
              Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-3  items-center text-white">
          <Link href={"/dashboard"}>
            <Button  className="rounded-full btn_class hover:bg-secondaryhover">
              Dashboard
            </Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button className="btn_class_primary p-1 px-2 rounded-full">Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
