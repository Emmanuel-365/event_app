
import React from 'react';
import { CommentItem } from './CommentItem';

export const CommentList: React.FC<{ comments: any[], onReply: (content: string, parentId: number) => void }> = ({ comments, onReply }) => {
    return (
        <div className="space-y-4">
            {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} onReply={onReply} />
            ))}
        </div>
    );
};
