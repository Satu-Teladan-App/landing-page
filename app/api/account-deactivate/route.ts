import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Create Supabase client with service role for admin operations
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Verify the user token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Get request body
    const body = await request.json();
    const { deactivate } = body;

    if (typeof deactivate !== "boolean") {
      return NextResponse.json(
        { error: "Invalid deactivate value" },
        { status: 400 },
      );
    }

    // Update user deactivation status
    const { data, error } = await supabase
      .from("users")
      .update({ deactivated: deactivate })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating deactivation status:", error);
      return NextResponse.json(
        { error: "Failed to update account status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      deactivated: data.deactivated,
      message: deactivate
        ? "Account deactivated successfully"
        : "Account reactivated successfully",
    });
  } catch (error) {
    console.error("Account deactivation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Create Supabase client
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Verify the user token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Get user deactivation status
    const { data, error } = await supabase
      .from("users")
      .select("deactivated")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching deactivation status:", error);
      return NextResponse.json(
        { error: "Failed to fetch account status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      deactivated: data?.deactivated || false,
    });
  } catch (error) {
    console.error("Account status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
