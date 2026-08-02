import { Skill } from "@/types/skill";
import { formatDate } from "./utils";

export function calculateStreak(skills: Skill[]): number {
  if (!skills || skills.length === 0) return 0;

  const completed = skills.filter((skill) => skill.completed).map((skill) => skill.date).sort((a, b) => (a < b ? 1 : -1))
  if (completed.length === 0) return 0;

  let today: string | Date = new Date();
  let yesterday: string | Date = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  today = formatDate(today)
  yesterday = formatDate(yesterday)

  // streak valid if skill completed today or yesterday
  if (completed[0] !== today && completed[0] !== yesterday) return 0;

  let streak = 1;
  let current = new Date(completed[0])
  for (let i = 1; i < completed.length; i++) {
    const prev = new Date(current);
    prev.setDate(prev.getDate() - 1);
    const expected = formatDate(prev);

    if (completed[i] === expected) {
      streak++;
      current = prev;
    } else {
      break;
    }
  }

  return streak;
}