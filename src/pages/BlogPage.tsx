import React, { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data';
import BlogNavbar from '../components/BlogNavbar';
import BlogFilter from '../components/BlogFilter';

const groupPostsByYear = (posts: typeof blogPosts) => {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, typeof blogPosts>);
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const groupedPosts = useMemo(() => {
    return groupPostsByYear(filteredPosts);
  }, [filteredPosts]);

  const handleTagToggle = (tag: string) => {
    if (tag === 'all') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <BlogNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <BlogFilter selectedTags={selectedTags} onTagToggle={handleTagToggle} />

        <div className="space-y-12 mt-8">
          {Object.entries(groupedPosts)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
            .map(([year, posts]) => (
              <div key={year}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">{year}</h2>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>
                <div className="grid gap-4">
                  {posts.map(post => (
                    <Link 
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="block group"
                    >
                      <article className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={post.author.avatar} 
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-slate-400">{post.author.name}</span>
                            <span className="text-slate-600">•</span>
                            <div className="flex items-center gap-1.5 text-sm text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                              <span 
                                key={tag}
                                className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}