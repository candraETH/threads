import { NextResponse } from "next/server";
import { addTrackedUser, readTrackedUsers } from "@/lib/tracked-users";

export const runtime = "nodejs";

export async function GET() {
  const users = await readTrackedUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body?.username === "string" ? body.username : "";
    const user = await addTrackedUser(username);

    if (!user) {
      return NextResponse.json({ error: "Username wajib diisi." }, { status: 400 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan pengguna." }, { status: 500 });
  }
}
