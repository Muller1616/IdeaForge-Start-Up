"use client";

import { useState } from "react";
import { User } from "@/lib/db";
import { Mail, MapPin, Briefcase, Github, Linkedin, Calendar, Edit3, Save, X, User as UserIcon } from "lucide-react";
import { editProfile } from "@/lib/profileActions";

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await editProfile(formData);
      if (result && result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-xl">
        {/* Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-80" />
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between">
            {/* Avatar */}
            <div className="-mt-16 mb-4 rounded-full border-4 border-[var(--color-surface-elevated)] bg-[var(--color-surface)] p-2 h-32 w-32 flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover rounded-full" />
              ) : (
                <UserIcon className="h-16 w-16 text-[var(--color-text-muted)]" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-4 py-2 text-sm font-medium text-[var(--color-error)] transition hover:bg-[var(--color-error)]/20 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-[var(--color-error)]/10 p-4 text-sm text-[var(--color-error)] border border-[var(--color-error)]/20">
              {error}
            </div>
          )}

          {!isEditing ? (
            // VIEW MODE
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text)]">{user.username}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[var(--color-text-muted)]">
                {user.profession && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span>{user.profession}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formattedDate}</span>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                  {user.bio ? (
                    <p className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="text-[var(--color-text-muted)] italic">No bio provided yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-semibold mb-3">Skills</h2>
                  {user.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-medium text-[var(--color-primary)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[var(--color-text-muted)] italic">No skills added yet.</p>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">Links</h2>
                  <div className="space-y-3">
                    {user.linkedin ? (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition">
                        <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                        <span className="truncate">{user.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 text-[var(--color-border)]">
                        <Linkedin className="h-5 w-5" />
                        <span className="italic text-[var(--color-text-muted)]">Not configured</span>
                      </div>
                    )}

                    {user.github ? (
                      <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition">
                        <Github className="h-5 w-5 text-[var(--color-text)]" />
                        <span className="truncate">{user.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 text-[var(--color-border)]">
                        <Github className="h-5 w-5" />
                        <span className="italic text-[var(--color-text-muted)]">Not configured</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // EDIT MODE
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="profession" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Profession
                  </label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    defaultValue={user.profession}
                    disabled={isPending}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={user.location}
                    disabled={isPending}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Bio (Max 300 chars)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={user.bio}
                  maxLength={300}
                  rows={4}
                  disabled={isPending}
                  className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="skills" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  defaultValue={user.skills?.join(', ')}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="linkedin" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    defaultValue={user.linkedin}
                    disabled={isPending}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="github" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    defaultValue={user.github}
                    disabled={isPending}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="avatarUrl" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  name="avatarUrl"
                  defaultValue={user.avatarUrl}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:opacity-50"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white shadow-lg transition hover:bg-[var(--color-primary-dark)] active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-[var(--color-primary)]"
                >
                  {isPending ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
