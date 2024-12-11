import BottomBar from "@/components/dashboard/BottomBar";
import SideNav from "@/components/dashboard/Sidenav";
import TopBar from "@/components/dashboard/TopBar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  weight: ["400", "700"], // Optional: specify weights
  subsets: ["latin"], // Specify subsets
});


export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "AI powered finance tracker",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-backgroundDark1 text-white custom-scrollbar  ${ubuntu.className}`}>
        <main className="flex bg-backgroundDark1 custom-scrollbar">
          <div className="w-[20%] hidden md:block">
            <SideNav />
          </div>
          <Toaster className="stats_card border-none rounded-lg text-gray-300"/>
          <div className="mb-10"><TopBar/></div>
          <div className="md:w-[80%] w-full bg-backgroundDark2 md:rounded-2xl p-4 my-14 md:my-5 overflow-visible custom-scrollbar shadow-md shadow-[#ac8dd869]">
            {children}
          </div>
          <div>
            <BottomBar/>
          </div>
        </main>
      </body>
    </html>
  );
}
