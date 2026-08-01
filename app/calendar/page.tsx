import CalendarView from "@/components/CalendarView";
import { Home } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-3 justify-between p-6 border-b border-orange-400 bg-linear-to-t from-orange-100 via-white to-orange-50">
        <h2 className="font-[oswald] font-semibold text-3xl">Calendar</h2>

        <Link
          href="/"
          className="p-2 rounded-full hover:bg-orange-100 transition-colors duration-300"
        >
          <Home className="w-5 h-5 text-orange-600" />
        </Link>
      </div>

      <div className="p-6 max-w-4xl w-full mx-auto">
        <CalendarView />
      </div>
    </div>
  );
}
