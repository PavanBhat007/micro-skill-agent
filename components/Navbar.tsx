import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Calendar, LinkIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-linear-to-br from-amber-50 via-white to-amber-100 text-gray-950 w-full border border-amber-300 shadow-sm shadow-amber-300 px-6 py-2">
      <div className="flex justify-between items-start">
        <Link href="/" title="Home">
          <h1 className="font-[poppins] font-bold text-3xl">MICRO SKILL AGENT</h1>
        </Link>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-4 py-1.5 border border-orange-400 rounded text-orange-600 font-medium hover:bg-orange-50">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-1.5 bg-orange-500 text-white rounded font-medium hover:bg-orange-600">
                Sign Up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              href="/calendar"
              title="View Calendar"
              className="text-sm font-medium text-amber-500 hover:text-amber-600 mr-2 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 hover:fill-amber-100 transition-colors duration-300" />
            </Link>
            <Link
              href="/profile"
              title="View Profile"
              className="text-sm font-medium text-amber-500 hover:text-amber-600 mr-2 transition-all duration-300"
            >
              <LinkIcon className="w-5 h-5 hover:fill-amber-100 transition-colors duration-300" />
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
