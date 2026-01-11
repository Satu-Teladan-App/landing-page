import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

interface RegisterRequestBody {
  email: string;
  password: string;
  confirmPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RegisterRequestBody = await request.json();
    const { email, password, confirmPassword } = body;

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

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Password tidak cocok" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Sign up with email and password
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Registration error:", error);

      // Return user-friendly error messages
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Email sudah terdaftar" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Gagal mendaftar" },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Gagal membuat akun" },
        { status: 500 }
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil. Silakan cek email untuk verifikasi.",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        },
        needsEmailVerification: true,
      },
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
