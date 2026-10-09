
"use client";

import Logo from "@/assets/logo-icon.png";
import Image from "next/image";
import CategoryNav from "./CategoryNav";
import { Button } from "@heroui/react";
import Link from "next/link";

const Navbar = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <header className="border-b bg-white">
      {/* Main header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Left: Logo and date */}
        <div className="flex items-center gap-3">
          <Image
            src={Logo}
            alt="বাজার দর logo"
            width={50}
            height={50}
            className="bg-green-900"
          />

          <div>
            <h1 className="text-xl font-bold text-green-800">
              বাজার দর
            </h1>
            <span className="text-sm text-gray-500">
              {date}
            </span>
          </div>
        </div>

        {/* Right: Authentication */}
        <div className="flex items-center gap-3">
         <Link href={'/sign-in'}>
          <Button
          
            variant="ghost">
            সাইন ইন
          </Button>
         </Link>
          
          <Link href={'/sign-up'}>
          <Button className={'bg-green-700'} >
            সাইন আপ
          </Button>
          </Link>
        </div>
      </div>

      {/* Second row: Categories */}
      <div className="mx-auto max-w-7xl px-4">
        <CategoryNav />
      </div>
    </header>
  );
};

export default Navbar;
