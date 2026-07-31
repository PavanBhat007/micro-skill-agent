import { getDb } from "@/lib/mongodb";
import { formatDate } from "@/lib/utils";
import { groq } from "@ai-sdk/groq";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = formatDate(new Date());
    const db = await getDb();

    const skill = await db.collection("skills").findOne({
      userId,
      date: today,
    });

    if (skill) {
      return NextResponse.json({ skill: skill }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          skill: null,
          message: "No skill generated for today, generate a skill",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error generating skill: ", error);
    return NextResponse.json(
      {
        error: "Failed to fetch skill",
        errorDetails: error,
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = formatDate(new Date());
    const db = await getDb();

    const existingSkill = await db.collection("skills").findOne({
      userId,
      date: today,
    });

    if (existingSkill) {
      return NextResponse.json(
        {
          skill: existingSkill,
        },
        { status: 200 },
      );
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `
        Generate one small, practical micro-skill that a person can learn and practice in under 15 minutes today.

        Return the response in this exact format:

        Title: [short title]
        Description: [2-3 sentences explaining the skill and how to practice it]
        Category: [one word category like Productivity, Communication, Coding, Health, etc.]
      `,
    });

    // LLM Response Parsing
    const titleMatch = text.match(/Title:\s*(.+)/);
    const descriptionMatch = text.match(
      /Description:\s*([\s\S]+?)(?=Category:|$)/,
    );
    const categoryMatch = text.match(/Category:\s*(.+)/);

    const title = titleMatch?.[1]?.trim() || "Untitled Skill";
    const description = descriptionMatch?.[1]?.trim() || text;
    const category = categoryMatch?.[1]?.trim() || "General";

    const newSkill = {
      userId,
      date: today,
      title,
      description,
      category,
      completed: false,
      createdAt: new Date(),
    };

    const result = await db.collection("skills").insertOne(newSkill);

    return NextResponse.json(
      {
        skill: {
          ...newSkill,
          _id: result.insertedId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error generating skill: ", error);
    return NextResponse.json(
      {
        error: "Failed to generate skill",
        errorDetails: error,
      },
      { status: 500 },
    );
  }
}
