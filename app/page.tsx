import updateProfileAction from "@/actions/update-profile.action";
import InputField from "@/components/InputField"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-linear-to-br from-amber-50 via-white to-amber-100 text-gray-950 w-full border border-amber-300 shadow-sm shadow-amber-300 px-6 py-12">
        <h1 className="font-[oswald] font-bold text-5xl">MICRO SKILL AGENT</h1>
        <p className="mt-2">Learn one &apos;<span className="font-semibold underline italic text-orange-500">Micro Skill</span>&apos; every day</p>
      </div>

      <div className="w-full border-b border-amber-300 shadow-sm shadow-amber-300">
        <h2 className="font-[oswald] font-semibold text-3xl w-full border-b border-orange-400 pb-2 bg-linear-to-t from-orange-100 via-white to-orange-50 p-6">User Profile</h2>

        <form action={updateProfileAction} className="px-6 py-8 flex flex-col gap-4">
          <InputField name="role" label="Role" />
          <InputField name="techStack" label="Tech Stack" />
          <InputField name="goals" label="Goals" />
          <InputField name="level" label="Level" />

          <button type="submit" className="bg-amber-100 border border-orange-300 rounded w-fit px-4 py-1 text-amber-500 font-semibold cursor-pointer hover:bg-orange-300 hover:text-amber-50 transition-colors duration-300">Update Profile</button>
        </form>
      </div>

      <div className="w-full">
        <h2 className="font-[oswald] font-semibold text-3xl w-full border-b border-orange-400 pb-2 bg-linear-to-t from-orange-100 via-white to-orange-50 p-6">SKILL of the Day</h2>

        <div>
          
        </div>
      </div>
    </div>
  );
}
