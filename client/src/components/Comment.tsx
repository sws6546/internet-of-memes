import { CommentType } from "../types";

export default function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className="p-4 bg-base-200 rounded-xl border border-accent-content">
      <p className="text-sm text-secondary">{comment.author}</p>
      <p>{comment.textContent}</p>
      <p className="text-xs text-accent">{new Date(comment.createdAt).toDateString()}</p>
    </div>
  )
}
