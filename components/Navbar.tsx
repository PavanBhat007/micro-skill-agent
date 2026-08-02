import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Calendar, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-stone-200 px-4 sm:px-6 py-3 shadow-xs transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link href="/" title="Home" className="group flex items-center gap-2">
          <h1 className="font-[poppins] font-bold text-lg sm:text-xl text-stone-800 tracking-tight group-hover:text-indigo-600 transition-colors">
            MICRO SKILL AGENT
          </h1>
        </Link>

        {/* Navigation & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                Log In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-all duration-200">
                Sign Up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              href="/calendar"
              title="View Calendar"
              className="p-2 text-stone-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
            </Link>

            <Link
              href="/profile"
              title="View Profile"
              className="p-2 text-stone-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <div className="pl-1 flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 ring-2 ring-stone-200 hover:ring-indigo-300 transition-all",
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
