import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequestBody = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password harus minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      console.error("Login error:", error);

      // Return user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          { error: "Email atau password salah" },
          { status: 401 }
        );
      }

      if (error.message.includes("Email not confirmed")) {
        return NextResponse.json(
          { error: "Email belum diverifikasi. Silakan cek email Anda." },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Gagal login" },
        { status: 401 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Gagal membuat sesi login" },
        { status: 500 }
      );
    }

    // Return success with session data
    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
