export interface Skill {
  _id?: number;
  userId: string;
  date: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface GeneratedSkill {
  title: string;
  description: string;
  category: string;
  completed?: boolean;
}
