import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-linear-to-br from-amber-50 via-white to-amber-100 text-gray-950 w-full border border-amber-300 shadow-sm shadow-amber-300 px-6 py-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-[oswald] font-bold text-5xl">
            MICRO SKILL AGENT
          </h1>
          <p className="mt-2">
            Learn one &apos;
            <span className="font-semibold underline italic text-orange-500">
              Micro Skill
            </span>
            &apos; every day
          </p>
        </div>

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
            <Link href="/profile" className="text-sm font-medium text-stone-600 hover:text-stone-900 mr-2 transition-colors duration-300">
              <LinkIcon className="w-5 h-5" />
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  )
}