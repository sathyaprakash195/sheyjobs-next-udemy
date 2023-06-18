import { connectDB } from "@/config/dbConfig";
import { sendEmail } from "@/helpers/sendEmail";
import { validateJWT } from "@/helpers/validateJWT";
import Application from "@/models/applicationModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    await validateJWT(request);
    const reqBody = await request.json();
    const application: any = await Application.create(reqBody);

    await sendEmail({
      to: application.job.user.email,
      subject: "New application received",
      text: `You have received a new application from ${application.user.name}`,
      html: `<div>
      <p>You have received a new application from ${application.user.name}</p>
      <p>Applicant's name is ${application.user.name}</p>
      <p>Applicant's email: ${application.user.email}</p>
      <p>Applicant's phone number: ${application.user.phone}</p>
      </div>`,
    });

    return NextResponse.json({
      message: "You have successfully applied for this job",
      data: application,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    validateJWT(request);

    // fetch query string parameters
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");
    const job = searchParams.get("job");

    const filtersObject: any = {};
    if (user) {
      filtersObject["user"] = user;
    }

    if (job) {
      filtersObject["job"] = job;
    }

    const applications = await Application.find(filtersObject)
      .populate("user")
      .populate({
        path: "job",
        populate: {
          path: "user",
        },
      });
    return NextResponse.json({
      message: "Jobs fetched successfully",
      data: applications,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
