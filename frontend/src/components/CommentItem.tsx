
import React, { useState } from 'react';
import { CommentForm } from './CommentForm';

export const CommentItem: React.FC<{ comment: any, onReply: (content: string, parentId: number) => void }> = ({ comment, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center mb-2">
                <div className="font-bold">{comment.user.email}</div>
                <div className="text-xs text-neutral-500 ml-2">{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
            <p>{comment.content}</p>
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-sm text-primary-600 mt-2">
                Reply
            </button>
            {showReplyForm && (
                <div className="mt-4 pl-4 border-l-2 border-neutral-300 dark:border-neutral-700">
                    <CommentForm onSubmit={(content) => {
                        onReply(content, comment.id);
                        setShowReplyForm(false);
                    }} parentId={comment.id} />
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-neutral-300 dark:border-neutral-700 space-y-4">
                    {comment.replies.map((reply: any) => (
                        <CommentItem key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};
