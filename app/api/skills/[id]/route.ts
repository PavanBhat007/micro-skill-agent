import { getDb } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

type UpdateProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: UpdateProps) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Skill" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("skills").findOneAndUpdate(
      // FILTER
      {
        _id: new ObjectId(id),
        userId,
      },

      // UPDATE OPERATION
      {
        $set: {
          completed: true,
          completedAt: new Date(),
        },
      },

      // OPTIONS
      {
        returnDocument: "after",
      },
    );

    if (!result) {
      return NextResponse.json({ error: "Skill not found!" }, { status: 404 });
    }

    return NextResponse.json({ skill: result }, { status: 200 });
  } catch (error) {
    console.error("Error updating skill!", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 },
    );
  }
}
