
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const CommentForm: React.FC<{ onSubmit: (content: string, parentId?: number) => void, parentId?: number }> = ({ onSubmit, parentId }) => {
    const [content, setContent] = useState('');
    const { user } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content, parentId);
        setContent('');
    };

    if (!user) {
        return (
            <div className="text-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <p>You must be logged in to comment.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentId ? "Write a reply..." : "Write a comment..."}
                className="w-full p-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                rows={3}
            />
            <button type="submit" className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg">
                {parentId ? "Reply" : "Post Comment"}
            </button>
        </form>
    );
};
