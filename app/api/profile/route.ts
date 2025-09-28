import { createClient } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  hometown: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (profileError) {
      console.error("Error updating profile:", profileError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error in PUT /api/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
