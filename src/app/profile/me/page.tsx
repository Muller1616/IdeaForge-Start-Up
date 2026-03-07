import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function MyProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    // Should be caught by middleware normally, but double safety
    redirect("/login");
  }

  return <ProfileClient user={user} />;
}
