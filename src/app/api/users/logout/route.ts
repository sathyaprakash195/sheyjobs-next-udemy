import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout Successfully" },
      { status: 200 }
    );

    // Remove the cookie
    response.cookies.set("token", "", { maxAge: 0 });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
