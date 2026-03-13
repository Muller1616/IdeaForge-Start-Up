"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import {
  ArrowUp,
  UserPlus,
  Share2,
  Calendar,
  ChevronUp,
  Check,
  X,
  Reply,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { InlineNotification } from "@/components/ui/InlineNotification";
import { ConfirmDeletePopup } from "@/components/ui/ConfirmDeletePopup";
import type { Idea } from "@/lib/ideas";
import type { Comment } from "@/lib/comments";
import type { JoinRequest } from "@/lib/joinRequests";
import type { User } from "@/lib/db";
import {
  upvoteIdea,
  postComment,
  postReply,
  requestToJoinIdea,
  approveJoinRequest,
  rejectJoinRequest,
  editComment,
  deleteCommentAction,
} from "@/lib/ideaActions";

interface IdeaDetailClientProps {
  idea: Idea;
  currentUser: User | null;
  comments: Comment[];
  hasUpvoted: boolean;
  joinRequests: JoinRequest[];
  userJoinRequest: JoinRequest | null;
  isOwner: boolean;
  /** Idea owner's profile picture from DB; null/empty = use placeholder */
  ownerAvatarUrl?: string | null;
}

export default function IdeaDetailClient({
  idea,
  currentUser = null,
  comments = [],
  hasUpvoted = false,
  joinRequests = [],
  userJoinRequest = null,
  isOwner = false,
  ownerAvatarUrl = null,
}: IdeaDetailClientProps) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [upvotes, setUpvotes] = useState(idea.upvotes ?? 0);
  const [userHasUpvoted, setUserHasUpvoted] = useState(hasUpvoted);
  const [commentList, setCommentList] = useState(Array.isArray(comments) ? comments : []);
  const [requestList, setRequestList] = useState(Array.isArray(joinRequests) ? joinRequests : []);
  const [loadingUpvote, setLoadingUpvote] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [notification, setNotification] = useState<{ type: "error" | "success" | "warning"; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; isReply: boolean } | null>(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const placeholderAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(idea.authorUsername)}&backgroundColor=111827&textColor=ffffff`;
  const displayOwnerAvatarUrl = ownerAvatarUrl?.trim() || placeholderAvatarUrl;
  const ownerAvatarIsDataOrExternal = !!ownerAvatarUrl?.trim();
  const formattedDate = new Date(idea.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleUpvote = async () => {
    if (!currentUser || isOwner) return;
    setLoadingUpvote(true);
    const result = await upvoteIdea(idea.id);
    setLoadingUpvote(false);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      return;
    }
    if (result.upvotes !== undefined) {
      setUpvotes(result.upvotes);
      setUserHasUpvoted(!userHasUpvoted);
      setNotification({ type: "success", message: userHasUpvoted ? "Upvote removed." : "Upvoted!" });
    }
  };

  const handlePostComment = async () => {
    if (!currentUser) {
      setNotification({ type: "error", message: "You must be logged in to comment." });
      return;
    }
    const content = commentText.trim();
    if (!content) {
      setNotification({ type: "warning", message: "Write a comment first." });
      return;
    }
    setLoadingComment(true);
    const result = await postComment(idea.id, content);
    setLoadingComment(false);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      return;
    }
    if (result.comment) {
      setCommentList((prev) => [...prev, result.comment!]);
      setCommentText("");
      setNotification({ type: "success", message: "Comment posted." });
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!currentUser || !isOwner) return;
    const content = replyText.trim();
    if (!content) {
      setNotification({ type: "warning", message: "Write a reply first." });
      return;
    }
    setLoadingComment(true);
    const result = await postReply(idea.id, parentId, content);
    setLoadingComment(false);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      return;
    }
    if (result.comment) {
      setCommentList((prev) => [...prev, result.comment!]);
      setReplyToId(null);
      setReplyText("");
      setNotification({ type: "success", message: "Reply posted." });
    }
  };

  const handleRequestToJoin = async () => {
    if (!currentUser || isOwner) return;
    const result = await requestToJoinIdea(idea.id);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      return;
    }
    setNotification({ type: "success", message: "Join request sent to the idea owner." });
  };

  const handleApprove = async (requestId: string) => {
    const result = await approveJoinRequest(requestId, idea.id);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      return;
    }
    setRequestList((prev) => prev.filter((r) => r.id !== requestId));
    setNotification({ type: "success", message: "Request approved." });
    router.refresh();
  };

  const handleReject = async (requestId: string) => {
    const result = await rejectJoinRequest(requestId, idea.id);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      return;
    }
    setRequestList((prev) => prev.filter((r) => r.id !== requestId));
    setNotification({ type: "success", message: "Request rejected." });
    router.refresh();
  };

  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleSaveEditComment = async () => {
    if (!editingCommentId || !editContent.trim()) return;
    setLoadingEdit(true);
    const result = await editComment(editingCommentId, editContent.trim());
    setLoadingEdit(false);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      return;
    }
    if (result.comment) {
      setCommentList((prev) =>
        prev.map((c) => (c.id === result.comment!.id ? result.comment! : c))
      );
      setEditingCommentId(null);
      setEditContent("");
      setNotification({ type: "success", message: "Comment updated." });
      router.refresh();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsDeletingComment(true);
    const result = await deleteCommentAction(commentId);
    setIsDeletingComment(false);
    if (result.error) {
      setNotification({ type: "error", message: result.error });
      setDeleteConfirm(null);
      return;
    }
    setCommentList((prev) => prev.filter((c) => c.id !== commentId));
    setEditingCommentId((id) => (id === commentId ? null : id));
    setDeleteConfirm(null);
    setNotification({ type: "success", message: "Comment deleted." });
    router.refresh();
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/ideas/${idea.id}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("execCommand failed");
      }
      setNotification({ type: "success", message: "Link copied to clipboard." });
    } catch {
      setNotification({ type: "error", message: "Could not copy link." });
    }
  };

  const topLevelComments = commentList.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    commentList.filter((c) => c.parentId === parentId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <BackButton fallbackHref="/ideas">Back to Ideas</BackButton>
      </div>

      {notification && (
        <div className="mb-6">
          <InlineNotification
            type={notification.type}
            message={notification.message}
            onDismiss={() => setNotification(null)}
            autoDismissSeconds={5}
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{idea.status}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
                {idea.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Posted {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <ChevronUp className="h-4 w-4" />
                  {upvotes} upvotes
                </span>
              </div>
            </div>

            <div className="space-y-8 p-8">
              <section>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Description
                </h2>
                <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--color-text-muted)]">
                  {idea.description}
                </p>
              </section>
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
              {/* Non-owner: Upvote */}
              {!isOwner && currentUser && (
                <Button
                  variant={userHasUpvoted ? "primary" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={handleUpvote}
                  disabled={loadingUpvote}
                >
                  <ArrowUp className="h-4 w-4" />
                  {upvotes} Upvotes
                </Button>
              )}
              {isOwner && (
                <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <ChevronUp className="h-4 w-4" />
                  {upvotes} upvotes
                </span>
              )}

              {/* Non-owner: Request to Join (or status if already requested) */}
              {!isOwner && currentUser && (
                <>
                  {userJoinRequest ? (
                    <span
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                        userJoinRequest.status === "approved"
                          ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                          : userJoinRequest.status === "rejected"
                            ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                            : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
                      }`}
                    >
                      Your request: {userJoinRequest.status.charAt(0).toUpperCase() + userJoinRequest.status.slice(1)}
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-2"
                      onClick={handleRequestToJoin}
                    >
                      <UserPlus className="h-4 w-4" />
                      Request to Join
                    </Button>
                  )}
                </>
              )}

              {/* Owner: Share */}
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              )}
            </div>
          </Card>

          {/* Comments */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              Comments ({commentList.length})
            </h2>

            {/* Comment form: all logged-in users can comment */}
            {currentUser && (
              <div className="mt-6">
                <textarea
                  placeholder={isOwner ? "Reply to the community..." : "Add a comment..."}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={handlePostComment}
                  disabled={loadingComment}
                >
                  {isOwner ? "Post as owner" : "Post Comment"}
                </Button>
              </div>
            )}
            {!currentUser && (
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                Log in to comment.
              </p>
            )}

            <div className="mt-8 space-y-6">
              {topLevelComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-[var(--color-border)] pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-sm font-semibold text-white">
                      {comment.authorUsername.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[var(--color-text)]">
                          {comment.authorUsername}
                        </span>
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {currentUser?.id === comment.authorId && (
                          <span className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEditComment(comment)}
                              className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-primary)]"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm({ id: comment.id, isReply: false })}
                              className="rounded p-1 text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        )}
                      </div>
                      {editingCommentId === comment.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
                            rows={2}
                          />
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="primary" onClick={handleSaveEditComment} disabled={loadingEdit}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelEditComment}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-[var(--color-text-muted)]">
                          {comment.content}
                        </p>
                      )}
                      {/* Owner can reply */}
                      {isOwner && currentUser && (
                        <div className="mt-2">
                          {replyToId === comment.id ? (
                            <div className="mt-2">
                              <textarea
                                placeholder="Write a reply..."
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <div className="mt-2 flex gap-2">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handlePostReply(comment.id)}
                                  disabled={loadingComment}
                                >
                                  Reply
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setReplyToId(null);
                                    setReplyText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
                              onClick={() => setReplyToId(comment.id)}
                            >
                              <Reply className="h-3 w-3" />
                              Reply
                            </button>
                          )}
                        </div>
                      )}
                      {/* Replies */}
                      {getReplies(comment.id).length > 0 && (
                        <div className="mt-4 ml-6 space-y-4 border-l-2 border-[var(--color-border)] pl-4">
                          {getReplies(comment.id).map((reply) => (
                            <div key={reply.id}>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-[var(--color-text)]">
                                  {reply.authorUsername}
                                </span>
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                                {currentUser?.id === reply.authorId && (
                                  <span className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditComment(reply)}
                                      className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-primary)]"
                                      title="Edit"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirm({ id: reply.id, isReply: true })}
                                      className="rounded p-1 text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </span>
                                )}
                              </div>
                              {editingCommentId === reply.id ? (
                                <div className="mt-2">
                                  <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
                                    rows={2}
                                  />
                                  <div className="mt-2 flex gap-2">
                                    <Button size="sm" variant="primary" onClick={handleSaveEditComment} disabled={loadingEdit}>
                                      Save
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={handleCancelEditComment}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                  {reply.content}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {commentList.length === 0 && (
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                No comments yet. Be the first to comment.
              </p>
            )}
          </Card>

          {/* Owner: Join requests */}
          {isOwner && requestList.length > 0 && (
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                Join requests
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Approve to let them comment, vote, and contribute. Rejected users are notified and cannot access team-only content.
              </p>
              <div className="mt-4 space-y-3">
                {requestList
                  .filter((r) => r.status === "pending")
                  .map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
                    >
                      <div>
                        <p className="font-medium text-[var(--color-text)]">
                          {req.username}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          className="gap-1"
                          onClick={() => handleApprove(req.id)}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-[var(--color-error)]"
                          onClick={() => handleReject(req.id)}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-[var(--color-text)]">
              Idea Owner
            </h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                {ownerAvatarIsDataOrExternal ? (
                  <img
                    src={displayOwnerAvatarUrl}
                    alt={idea.authorUsername}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={placeholderAvatarUrl}
                    alt={idea.authorUsername}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)]">
                  {idea.authorUsername}
                </p>
              </div>
            </div>
            <Link href={`/profile/${idea.authorId}`}>
              <Button variant="outline" className="mt-4 w-full" size="sm">
                View Profile
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-[var(--color-text)]">
              More Ideas
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Discover more startup ideas from the community.
            </p>
            <Link href="/ideas">
              <Button variant="outline" className="mt-4 w-full" size="sm">
                Browse All Ideas
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {deleteConfirm && (
        <ConfirmDeletePopup
          message={
            deleteConfirm.isReply
              ? "Are you sure you want to delete this reply? This cannot be undone."
              : "Are you sure you want to delete this comment? This cannot be undone."
          }
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => handleDeleteComment(deleteConfirm.id)}
          isDeleting={isDeletingComment}
        />
      )}
    </div>
  );
}
