"use client";
import Image from "next/image";
import { menuList } from "@/constants/constant";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <div className="min-h-screen py-10 px-5 ms-2">
      <div className="flex flex-col gap-4 items-center justify-evenly min-h-[90vh] mt-5">
        <div className="flex flex-col gap-1 justify-center items-center ">
          <Image
            src={user?.imageUrl ? user.imageUrl : "/user.jpg"}
            width={100}
            height={100}
            alt="user"
            className="rounded-full shadow-md shadow-secondary"
          />
          {user?.fullName && (
            <p className="px-2 py-1 mt-3 nav_link_name text-gray-300 text-sm">
              {user?.fullName}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col justify-center items-start gap-3">
          {menuList.map((menu, index) => {
            const isActive =
              pathname === menu.path ||
              (pathname.startsWith(menu.path) &&
                pathname.split("/").length === menu.path.split("/").length);
            return (
              <Link href={menu.path} key={index} className="">
                <div
                  className={`px-4 py-2  flex flex-row gap-5 text-gray-200 font-normal rounded-lg  cursor-pointer hover:scale-110 transition_class ${
                    isActive && "nav_link"
                  }`}
                >
                  <menu.icon size={30} strokeWidth={1} />
                  <p className="text-lg font-light">{menu.name}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div>
          <Image src={"/logo.png"} alt="logo" width={130} height={110} />
        </div>
      </div>
    </div>
  );
}

export default SideNav;
