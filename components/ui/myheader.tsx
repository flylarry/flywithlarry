import React from "react";
import { UserAvatar } from "../UserAvatar";
import Link from "next/link";

const MyHeader = () => {
  return (
    <header className="flex flex-row justify-between items-center p-2 px-4 ">
      <Link
        href="/"
        className="text-gray-800 font-semibold hover:text-gray-600 w-fit flex items-center gap-2"
      >
        <p>LarryAI</p>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/about"
          className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
        >
          Our Story
        </Link>
        <UserAvatar />
      </div>
    </header>
  );
};

export default MyHeader;
