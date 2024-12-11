"use client";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function TopBar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-black backdrop-blur-lg bg-opacity-30 rounded-b-2xl text-white shadow-t-lg md:hidden flex justify-between px-3 items-center py-2 border-b border-gray-700">
        <Image
          src={"/logo.png"}
          width={70}
          height={70}
          alt="user"
          className=""
        />
        <Image
          src={user?.imageUrl ? user.imageUrl : "/user.jpg"}
          width={40}
          height={40}
          alt="user"
          className="rounded-full shadow-sm shadow-secondary"
        />
    </div>
  );
}

export default TopBar;
