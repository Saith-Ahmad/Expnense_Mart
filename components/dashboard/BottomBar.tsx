"use client";

import { menuList } from "@/constants/constant";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function BottomBar() {
    const { user } = useUser();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-black backdrop-blur-md bg-opacity-30 rounded-t-2xl text-white shadow-t-lg md:hidden flex justify-evenly items-center py-2 border-t border-gray-700">
      {menuList.map((menu, index) => {
        const isActive =
          pathname === menu.path ||
          (pathname.startsWith(menu.path) &&
            pathname.split("/").length === menu.path.split("/").length);
        return (
          <Link href={menu.path} key={index}>
            <div
              className={`flex flex-col items-center justify-center ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              <menu.icon size={25} strokeWidth={1} />
              <span
                className={`text-xs mt-1 ${
                  isActive ? "font-medium" : "font-light"
                }`}
              >
                {menu.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default BottomBar;
