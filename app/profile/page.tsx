import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    redirect("/auth");
  }

  return <ProfileClient user={profile} />;
}
