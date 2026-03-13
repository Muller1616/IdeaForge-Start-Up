import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getIdeas } from "@/lib/ideas";
import ProfileView from "./ProfileView";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const [profileUser, currentUser, allIdeas] = await Promise.all([
    getUserById(userId),
    getCurrentUser(),
    getIdeas(),
  ]);

  if (!profileUser) {
    notFound();
  }

  const { password: _pw, ...safeUser } = profileUser;
  const ideas = allIdeas.filter((i) => i.authorId === profileUser.id);
  const isOwnProfile = !!currentUser && currentUser.id === profileUser.id;

  return (
    <ProfileView
      profileUser={safeUser as typeof profileUser}
      ideas={ideas}
      isOwnProfile={isOwnProfile}
    />
  );
}
