"use client";

import updateProfileAction from "@/actions/update-profile.action";
import InputField from "./InputField";
import { useAuth } from "@clerk/nextjs";

export default function UserProfile() {
  const { isSignedIn } = useAuth();

  return (
    <div className="px-6 py-2">
      {isSignedIn ? (
        <form action={updateProfileAction} className="px-6 py-8 flex flex-col gap-4">  
          <InputField name="role" label="Role" />
          <InputField name="techStack" label="Tech Stack" />
          <InputField name="goals" label="Goals" />
          <InputField name="level" label="Level" />
  
          <button
            type="submit"
            className="bg-amber-100 border border-orange-300 rounded w-fit px-4 py-1 text-amber-500 font-semibold cursor-pointer hover:bg-orange-300 hover:text-amber-50 transition-colors duration-300"
          >
            Update Profile
          </button>
        </form>
      ) : (
        <p>Please Login to view profile</p>
      )}
    </div>
  )
}