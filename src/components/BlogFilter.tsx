import React from 'react';
import { blogPosts } from '../data';

const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

interface BlogFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function BlogFilter({ selectedTags, onTagToggle }: BlogFilterProps) {
  return (
    <div className="sticky top-16 z-30 bg-slate-950/95 backdrop-blur-sm py-4 border-b border-slate-800/50">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onTagToggle('all')}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${selectedTags.length === 0
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'}
          `}
        >
          all posts
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all
              ${selectedTags.includes(tag)
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'}
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}