import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey
);

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== process.env.INGEST_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.node) {
      return NextResponse.json(
        { error: "node is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("sensor_data")
      .insert({
        node: body.node,
        water_temp: body.waterTemp ?? null,
        ph: body.ph ?? null,
        ec: body.ec ?? null,
        tds: body.tds ?? null,
        air_temp: body.airTemp ?? null,
        humidity: body.humidity ?? null,
        battery: body.battery ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 500 }
    );
  }
}