import { getDb } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      return NextResponse.json(
        { error: "Year and Month are required" },
        { status: 400 },
      );
    }

    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const endDate = `${year}-${month.padStart(2, "0")}-31`;

    const db = await getDb();

    const skills = await db
      .collection("skills")
      .find({
        userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .toArray();

    return NextResponse.json({ skills: skills || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching skills: ", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 },
    );
  }
}
