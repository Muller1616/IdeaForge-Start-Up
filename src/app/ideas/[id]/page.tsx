import { notFound } from "next/navigation";
import { getIdeaById } from "@/lib/ideas";
import { getCurrentUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getCommentsByIdeaId } from "@/lib/comments";
import { hasUserUpvoted } from "@/lib/ideaActions";
import { getJoinRequestsByIdeaId, getJoinRequestByIdeaAndUser } from "@/lib/joinRequests";
import IdeaDetailClient from "./IdeaDetailClient";

interface IdeaPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaDetailPage({ params }: IdeaPageProps) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  let idea: Awaited<ReturnType<typeof getIdeaById>> = null;
  let currentUser: Awaited<ReturnType<typeof getCurrentUser>> = null;
  let comments: Awaited<ReturnType<typeof getCommentsByIdeaId>> = [];
  let joinRequests: Awaited<ReturnType<typeof getJoinRequestsByIdeaId>> = [];

  try {
    [idea, currentUser, comments, joinRequests] = await Promise.all([
      getIdeaById(id),
      getCurrentUser(),
      getCommentsByIdeaId(id).catch(() => []),
      getJoinRequestsByIdeaId(id).catch(() => []),
    ]);
  } catch (e) {
    console.error("[IdeaDetailPage]", e);
    notFound();
  }

  if (!idea) {
    notFound();
  }

  const isOwner = !!currentUser && currentUser.id === idea.authorId;
  let hasUpvoted = false;
  try {
    hasUpvoted = currentUser ? await hasUserUpvoted(id, currentUser.id) : false;
  } catch {
    hasUpvoted = false;
  }
  const ownerJoinRequests = isOwner ? (joinRequests ?? []) : [];
  const safeComments = Array.isArray(comments) ? comments : [];
  const userJoinRequest =
    currentUser && !isOwner
      ? await getJoinRequestByIdeaAndUser(id, currentUser.id).catch(() => null)
      : null;
  const ideaOwner = await getUserById(idea.authorId).catch(() => null);
  const ownerAvatarUrl = ideaOwner?.avatarUrl?.trim() || null;

  return (
    <IdeaDetailClient
      idea={idea}
      currentUser={currentUser}
      comments={safeComments}
      hasUpvoted={hasUpvoted}
      joinRequests={ownerJoinRequests}
      userJoinRequest={userJoinRequest}
      isOwner={isOwner}
      ownerAvatarUrl={ownerAvatarUrl}
    />
  );
}
