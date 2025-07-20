'use client';

import { useState } from 'react';
import { IconButton } from '@/components/spring-ui/icon-button';
import { AddIcon } from '@/icons/AddIcon';
import { ArrowRightIcon } from '@/icons/ArrowRightIcon';

export default function CreateAssetsPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    'Style', 'Image prompt', 'Goal', 'Aspect ratio'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleGenerate = () => {
    // TODO: Implement AI generation logic
    console.log('Generating with prompt:', prompt, 'and tags:', selectedTags);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Centered Layout */}
        <div className="text-center space-y-8">
          
          {/* Prominent Title */}
          <div className="space-y-4">
            <h1 className="title-text-bold text-4xl text-[var(--text-primary)]">
              What will you create?
            </h1>
            <p className="body-text text-lg text-[var(--text-secondary)]">
              Describe your vision and let AI bring it to life
            </p>
          </div>

          {/* Text Input Area */}
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your idea, and I'll bring it to life"
                className="w-full h-32 p-4 pr-20 border border-[var(--border-default)] rounded-lg bg-[var(--background-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              />
              <div className="absolute bottom-3 left-3">
                <IconButton variant="outline" size="comfortable">
                  <AddIcon />
                </IconButton>
              </div>
              <div className="absolute bottom-3 right-3">
                <IconButton variant="primary" size="comfortable">
                  <ArrowRightIcon />
                </IconButton>
              </div>
            </div>

            {/* Pill-style Option Tags */}
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-black/8 text-[var(--text-secondary)] hover:bg-black/12'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="px-8 py-4 bg-[var(--accent-primary)] text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent-primary)]"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 