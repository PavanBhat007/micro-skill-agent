export interface User {
  _id: string; // MongoDB ID
  userId: string; // Clerk user ID
  name: string;
  role: string;
  interests: string[];
  goals: string[];
  level: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
