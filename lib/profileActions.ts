"use server";

import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  hometown: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const data = {
      full_name: formData.get("full_name") as string,
      hometown: formData.get("hometown") as string,
      timezone: formData.get("timezone") as string,
      language: formData.get("language") as string,
    };

    // Remove empty strings
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value && value.trim() !== "")
    );

    const validatedData = updateProfileSchema.parse(cleanData);

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
      throw new Error("Failed to update profile");
    }

    revalidatePath("/profile");
    return { success: true, profile };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid data provided");
    }
    
    console.error("Error in updateProfile:", error);
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw new Error("Failed to fetch profile");
    }

    return profile;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
}

export async function getLarryMessageCount() {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get all chats for the user
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select("id")
      .eq("user_id", user.id);

    if (chatsError) {
      console.error("Error fetching chats:", chatsError);
      throw new Error("Failed to fetch chats");
    }

    if (!chats || chats.length === 0) {
      return 0;
    }

    const chatIds = chats.map(chat => chat.id);

    // Count messages from Larry (assistant role) in all user's chats
    const { count, error: messagesError } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in("chat_id", chatIds)
      .eq("role", "assistant");

    if (messagesError) {
      console.error("Error counting Larry messages:", messagesError);
      throw new Error("Failed to count Larry messages");
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getLarryMessageCount:", error);
    throw error;
  }
}
