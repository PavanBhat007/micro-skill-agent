import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
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

    return NextResponse.json(
      {
        skill: text,
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
