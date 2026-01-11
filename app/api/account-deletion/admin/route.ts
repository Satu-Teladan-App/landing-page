import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

// Admin endpoint to list all deletion requests
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Create Supabase client with service role for admin access
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify the user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check if user is admin (implement your admin check logic)
    // Example: Check if user has admin role in database
    // const { data: profile } = await supabase
    //   .from('profiles')
    //   .select('role')
    //   .eq('id', user.id)
    //   .single()
    //
    // if (profile?.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Forbidden: Admin access required' },
    //     { status: 403 }
    //   )
    // }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch deletion requests
    let query = supabase
      .from("account_deletion_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: requests, error: fetchError, count } = await query;

    if (fetchError) {
      console.error("Error fetching deletion requests:", fetchError);
      return NextResponse.json(
        { error: "Gagal mengambil data permintaan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        total: count || 0,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Admin get deletion requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Admin endpoint to process a deletion request
export async function PATCH(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");

    // Create Supabase client with service role for admin access
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify the user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check if user is admin (implement your admin check logic)

    // Parse request body
    const body = await request.json();
    const { request_id, action, notes } = body;

    if (!request_id || !action) {
      return NextResponse.json(
        { error: "request_id dan action harus diisi" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "completed"].includes(action)) {
      return NextResponse.json(
        { error: "action harus berupa approved, rejected, atau completed" },
        { status: 400 }
      );
    }

    // Update the deletion request
    const { data: updatedRequest, error: updateError } = await supabase
      .from("account_deletion_requests")
      .update({
        status: action,
        processed_at: new Date().toISOString(),
        processed_by: user.id,
        metadata: {
          notes: notes || null,
          processed_by_email: user.email,
        },
      })
      .eq("id", request_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating deletion request:", updateError);
      return NextResponse.json(
        { error: "Gagal memperbarui permintaan" },
        { status: 500 }
      );
    }

    // If approved or completed, actually delete the user account
    if (action === "completed") {
      // TODO: Implement actual account deletion
      // This should:
      // 1. Delete user data from all related tables
      // 2. Anonymize or delete user content
      // 3. Finally delete the auth user
      // Example:
      // await supabase.auth.admin.deleteUser(updatedRequest.user_id)
    }

    // TODO: Send email notification to user about the status

    return NextResponse.json({
      success: true,
      message: `Permintaan berhasil di${action}`,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Admin process deletion request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
