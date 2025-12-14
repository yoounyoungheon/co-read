import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const dirPath = path.join(process.cwd(), "public", "articles");

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));

  const jsonList = files.map((filename) => {
    const filePath = path.join(dirPath, filename);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return content;
  });

  return NextResponse.json(jsonList);
}
