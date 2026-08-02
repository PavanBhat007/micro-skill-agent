import { getDb } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// get current logged in user's profile
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const profile = await db.collection("users").findOne({ userId });
    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

// create/ update user profile -> after sign up so userId will be created
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, interests, goals, level } = body;

    if (!name || !role || !level) {
      return NextResponse.json(
        { error: "Name, Role and Level are required fields" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const profileData = {
      userId,
      name,
      role,
      level,
      interests: Array.isArray(interests) ? interests : [],
      goals: Array.isArray(goals) ? goals : [],
      onboardingCompleted: true,
      updatedAt: new Date(),
    };

    const result = await db.collection("users").findOneAndUpdate(
      { userId },
      {
        $set: profileData,
        $setOnInsert: { createdAt: new Date() },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    return NextResponse.json({ profile: result }, { status: 200 });
  } catch (error) {
    console.error("Error saving profile: ", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 },
    );
  }
}
