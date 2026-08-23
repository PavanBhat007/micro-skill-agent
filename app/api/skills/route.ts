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

    // if skill already generated today, resend the same instead of new
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

    // personalize skill generation based on user profile and skills completed already
    const profile = await db.collection("users").findOne({ userId });
    const recentSkills = await db
      .collection("skills")
      .find({ userId, completed: true })
      .sort({ date: -1 })
      .limit(15)
      .toArray();
    const skillContext = recentSkills.map((skill) => skill.title).filter(Boolean)

    // custom user-profile based prompt
    const prompt = `
    You are an expert personal coach that creates highly practical micro-skills.
    
    Generate exactly ONE new micro-skill the user can practice today.
    
    USER PROFILE:
    - Name: ${profile?.name || "User"}
    - Role: ${profile?.role || "Not specified"}
    - Level: ${profile?.level || "Beginner"}
    - Interests: ${profile?.interests?.length ? profile.interests.join(", ") : "General self-improvement"}
    - Goals: ${profile?.goals?.length ? profile.goals.join(", ") : "Improve a little every day"}
    
    RECENTLY COMPLETED SKILLS (do not repeat any of these):
    ${skillContext.length > 0 ? skillContext.map((t) => `- ${t}`).join("\n") : "- None yet"}
    
    RULES:
    1. Generate exactly ONE skill.
    2. The skill must be practical and completable in 15–30 minutes.
    3. Strongly match the user's Interests and Goals.
    4. Match the difficulty to the user's Level.
    5. If previous skills exist, make this a natural next step (progressive learning).
    6. Never repeat a completed skill (even if worded differently).
    7. Rotate categories when possible (don't stay in only one category).
    8. Be specific and actionable (tell the user exactly what to do).
    9. You may mention well-known free resources (books, docs, or official sites) only if you are confident they exist. Do not invent links.
    10. Keep the core practice under 30 minutes. The user can go deeper later if they want.
    
    IMPORTANT:
    - Do NOT use markdown.
    - Do NOT use bold, italics, bullet points, or extra symbols.
    - Follow the output format EXACTLY.
    
    OUTPUT FORMAT (copy this structure exactly):
    
    Title: short clear title here
    Description: 3-5 sentences explaining the skill and exactly how to practice it today. Include concrete steps.
    Category: OneWord
    `.trim();

    const model = process.env.MODEL_USED || "openai/gpt-oss-20b"
    let { text } = await generateText({
      model: groq(model),
      prompt,
      temperature: 0.6
    });

    // Clean common markdown artifacts
    text = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .trim();
    
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
