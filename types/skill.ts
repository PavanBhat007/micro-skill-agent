export interface Skill {
  _id: string;
  userId: string;
  date: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}
