import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

type Subscriber = {
  email: string;
  subscribedAt: string;
};

const subscribersFilePath = path.join(process.cwd(), "data", "subscribers.json");

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(subscribersFilePath, "utf8");
    const parsed = JSON.parse(raw) as Subscriber[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const subscribers = await readSubscribers();

    if (subscribers.some((subscriber) => subscriber.email === email)) {
      return NextResponse.json(
        { message: "You are already subscribed." },
        { status: 200 }
      );
    }

    const updatedSubscribers = [
      ...subscribers,
      { email, subscribedAt: new Date().toISOString() }
    ];

    await fs.mkdir(path.dirname(subscribersFilePath), { recursive: true });
    await fs.writeFile(
      subscribersFilePath,
      JSON.stringify(updatedSubscribers, null, 2),
      "utf8"
    );

    return NextResponse.json(
      { message: "Thanks, you are subscribed." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to process subscription right now." },
      { status: 500 }
    );
  }
}
