'use client';

import { useState, useEffect, useRef } from 'react';
import { IconButton } from '@/components/spring-ui/icon-button';
import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import AssetDetailModal from '@/components/designer/layout/panels/leftpanel/AssetDetailModal';
import { getAssetByUrl, getAllAssets, VoiceToneDocument } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
}

export default function BrandAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
      const [allAssets, setAllAssets] = useState<any[]>([]);
      const [isLoadingAsset, setIsLoadingAsset] = useState(false);
      const [voiceToneDocuments, setVoiceToneDocuments] = useState<VoiceToneDocument[]>([]);
      const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const loadingMessages = [
    "Checking brand guidelines",
    "Analyzing compliance", 
    "Generating on-brand content"
  ];

  // Logo image URLs
  const blackLogos = [
    'https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d50a3da6b5e7dac751d43_forme_logo-black.svg',
    'https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d512966e676495bc5b407_forme_logo-wordmark-black.svg',
    'https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d512966e676495bc5b407_forme_logo-wordmark-black.svg',
    'https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687d50a3da6b5e7dac751d43_forme_logo-black.svg'
  ];

  // Check if query matches demo query (case-insensitive, flexible)
  const isDemoQuery = (query: string): boolean => {
    const normalized = query.toLowerCase().trim();
    return normalized.includes('show') && 
           normalized.includes('logo') && 
           normalized.includes('black');
  };

  // Check if query is a brand compliance/copy check query
  const isBrandComplianceQuery = (query: string): boolean => {
    const normalized = query.toLowerCase().trim();
    return normalized.includes('copy');
  };

  // Extract copy text from query (simple extraction - takes text after "copy:" or entire message)
  const extractCopyText = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    const copyIndex = lowerQuery.indexOf('copy');
    
    if (copyIndex === -1) return query; // No "copy" found, return entire query
    
    // Try to find text after "copy:" or "copy "
    const afterCopy = query.slice(copyIndex + 4).trim();
    if (afterCopy.startsWith(':')) {
      return afterCopy.slice(1).trim() || query; // Text after "copy:"
    }
    
    // If no colon, check for quoted text or return text after "copy"
    const quotedMatch = query.match(/copy[:\s]+["']([^"']+)["']/i);
    if (quotedMatch) {
      return quotedMatch[1];
    }
    
    // Return text after "copy" or entire query if nothing found
    return afterCopy || query;
  };

  const handleSubmit = async () => {
    const query = prompt.trim();
    if (!query || isLoading) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsChatExpanded(true);
    setPrompt('');
    setIsLoading(true);
    setLoadingMessageIndex(0);

    // Check if it's the demo query (logo query)
    if (isDemoQuery(query)) {
      // Simulate loading time
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: 'Here are the latest versions of approved logos in black',
          images: blackLogos
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        setLoadingMessageIndex(0);
      }, 2000); // 2 seconds for demo
    } 
        // Check if it's a brand compliance/copy query
        else if (isBrandComplianceQuery(query)) {
          try {
            const copyText = extractCopyText(query);
            const brandGuidelines = getCombinedBrandGuidelines();
            
            // Check if brand guidelines are available
            if (!brandGuidelines || brandGuidelines.trim().length === 0) {
              const noGuidelinesMessage: Message = {
                role: 'assistant',
                content: 'No brand guidelines found. Please upload a voice & tone document on the Guidelines page first.'
              };
              setMessages(prev => [...prev, noGuidelinesMessage]);
              setIsLoading(false);
              setLoadingMessageIndex(0);
              return;
            }
            
            // Call OpenAI API with streaming
            const response = await fetch('/mary-prototype/api/brand-compliance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                sampleCopy: copyText,
                brandGuidelines: brandGuidelines,
                stream: true
              })
            });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (!reader) {
          throw new Error('No response body');
        }

        // Create initial assistant message for streaming
        let streamedContent = '';
        let formattedResponseReceived = false; // Track if we received formatted response

        // Add temporary loading message to show user that processing is happening
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: loadingMessages[loadingMessageIndex] || 'Analyzing brand compliance...' 
        }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // Stream complete - only show error if we didn't receive formatted response
                if (!formattedResponseReceived && streamedContent) {
                  try {
                    const jsonMatch = streamedContent.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      // This shouldn't happen if API works correctly, but fallback
                      const parsed = JSON.parse(jsonMatch[0]);
                      // Replace loading message with error
                      setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                          role: 'assistant',
                          content: 'Received response but formatting failed. Please try again.'
                        };
                        return updated;
                      });
                    }
                  } catch (e) {
                    // If parsing fails, show error
                    setMessages(prev => {
                      const updated = [...prev];
                      updated[updated.length - 1] = {
                        role: 'assistant',
                        content: 'Unable to parse response. Please try again.'
                      };
                      return updated;
                    });
                  }
                }
                setIsLoading(false);
                setLoadingMessageIndex(0);
              } else {
                try {
                  const parsed = JSON.parse(data);
                  
                  // Check if this is a formatted response (sent at the end)
                  if (parsed.type === 'formatted' && parsed.formatted) {
                    formattedResponseReceived = true; // Mark that we received formatted response
                    // Replace loading message with formatted response
                    setMessages(prev => {
                      const updated = [...prev];
                      updated[updated.length - 1] = {
                        role: 'assistant',
                        content: parsed.formatted
                      };
                      return updated;
                    });
                    setIsLoading(false);
                    setLoadingMessageIndex(0);
                  } else if (parsed.content) {
                    // Accumulate JSON silently - don't update UI
                    streamedContent += parsed.content;
                    // Keep loading indicator visible
                  }
                } catch (e) {
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }
        }
      } catch (error: any) {
        console.error('Error calling brand compliance API:', error);
        // Replace loading message with error message
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
            // Replace last message (loading message) with error
            updated[updated.length - 1] = {
              role: 'assistant',
              content: `Sorry, I encountered an error: ${error.message || 'Failed to check brand compliance'}. Please make sure your OpenAI API key is configured.`
            };
          } else {
            // Add error message if no loading message exists
            updated.push({
              role: 'assistant',
              content: `Sorry, I encountered an error: ${error.message || 'Failed to check brand compliance'}. Please make sure your OpenAI API key is configured.`
            });
          }
          return updated;
        });
        setIsLoading(false);
        setLoadingMessageIndex(0);
      }
    } 
    else {
      // For other queries, just show loading then no response (for now)
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessageIndex(0);
      }, 2000);
    }
  };

  const handleArrowClick = () => {
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

      // Fetch all assets for navigation support
      useEffect(() => {
        const fetchAllAssets = async () => {
          try {
            const assets = await getAllAssets();
            setAllAssets(assets);
          } catch (error) {
            console.error('Error fetching all assets:', error);
          }
        };
        fetchAllAssets();
      }, []);

      // Load voice & tone documents from localStorage
      useEffect(() => {
        try {
          const stored = localStorage.getItem('voiceToneDocuments');
          if (stored) {
            const parsed = JSON.parse(stored);
            setVoiceToneDocuments(parsed);
          }
        } catch (error) {
          console.error('Error loading voice & tone documents from localStorage:', error);
        }
      }, []);

      // Combine all extracted text from voice & tone documents
      const getCombinedBrandGuidelines = (): string => {
        if (voiceToneDocuments.length === 0) {
          return '';
        }
        return voiceToneDocuments
          .filter(doc => doc.extracted_text && doc.extracted_text.trim().length > 0)
          .map(doc => doc.extracted_text)
          .join('\n\n---\n\n'); // Separate documents with a divider
      };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle image click to open asset detail modal
  const handleImageClick = async (imageUrl: string) => {
    try {
      setIsLoadingAsset(true);
      const asset = await getAssetByUrl(imageUrl);
      
      if (asset) {
        // Transform asset to format expected by AssetDetailModal
        const modalAsset = {
          id: asset.id,
          type: asset.type || 'images',
          name: asset.name,
          fileSize: asset.fileSize || '96 kB',
          uploadedBy: asset.uploadedBy || 'Current User',
          uploadedDate: asset.uploadedDate || new Date().toISOString().split('T')[0],
          lastModifiedDate: asset.dateModified || asset.uploadedDate || new Date().toISOString().split('T')[0],
          title: asset.name,
          url: asset.url,
          altText: asset.altText || '',
          tags: asset.tags || [],
          status: asset.status || 'No status',
          fileType: asset.fileType || 'Images',
          width: asset.width || 0,
          height: asset.height || 0,
          version: asset.version || 'V1'
        };
        
        setSelectedAsset(modalAsset);
        setShowAssetDetailModal(true);
      } else {
        console.warn('Asset not found for URL:', imageUrl);
        // Could show a toast/notification here if desired
      }
    } catch (error) {
      console.error('Error fetching asset by URL:', error);
    } finally {
      setIsLoadingAsset(false);
    }
  };

  // Cycle through loading messages
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500); // Change message every 1.5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingMessages.length]);

  // Full-screen chat layout
  if (isChatExpanded) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-primary)]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="body-text prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:text-[var(--text-primary)] prose-strong:font-semibold">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                              h1: ({ children }) => <h1 className="text-lg font-semibold mb-3 mt-4">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-semibold mb-2 mt-3">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 mt-3">{children}</h3>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
                              hr: () => <hr className="my-4 border-t border-[var(--border-default)]" />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="body-text whitespace-pre-wrap">{message.content}</div>
                      )}
                  
                  {/* Image Grid for Assistant Messages */}
                  {message.role === 'assistant' && message.images && message.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {message.images.map((imageUrl, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="flex items-center justify-center p-4 bg-white rounded border border-[var(--border-default)] cursor-pointer hover:border-[var(--accent-primary)] transition-colors"
                          onClick={() => handleImageClick(imageUrl)}
                          title="Click to view asset details"
                        >
                          <img
                            alt={`logo-${imgIndex}`}
                            src={imageUrl}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="border-t border-[var(--border-default)] bg-[var(--bg-primary)] px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about brand compliance, request a workflow, or generate on-brand copy..."
                className="w-full h-32 p-4 pr-20 border border-[var(--border-default)] rounded-lg bg-[var(--background-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 left-3">
                <IconButton variant="outline" size="comfortable" disabled={isLoading}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </IconButton>
              </div>
              <div className="absolute bottom-3 right-3">
                <IconButton 
                  variant="primary" 
                  size="comfortable"
                  onClick={handleArrowClick}
                  disabled={!prompt.trim() || isLoading}
                >
                  <ArrowRightIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Detail Modal */}
        {showAssetDetailModal && selectedAsset && (
          <AssetDetailModal
            open={showAssetDetailModal}
            onOpenChange={setShowAssetDetailModal}
            asset={selectedAsset}
            assets={allAssets}
            currentIndex={allAssets.findIndex(a => a.id === selectedAsset.id)}
            onAssetChange={(newIndex) => {
              if (newIndex >= 0 && newIndex < allAssets.length) {
                const asset = allAssets[newIndex];
                const modalAsset = {
                  id: asset.id,
                  type: asset.type || 'images',
                  name: asset.name,
                  fileSize: asset.fileSize || '96 kB',
                  uploadedBy: asset.uploadedBy || 'Current User',
                  uploadedDate: asset.uploadedDate || new Date().toISOString().split('T')[0],
                  lastModifiedDate: asset.dateModified || asset.uploadedDate || new Date().toISOString().split('T')[0],
                  title: asset.name,
                  url: asset.url,
                  altText: asset.altText || '',
                  tags: asset.tags || [],
                  status: asset.status || 'No status',
                  fileType: asset.fileType || 'Images',
                  width: asset.width || 0,
                  height: asset.height || 0,
                  version: asset.version || 'V1'
                };
                setSelectedAsset(modalAsset);
              }
            }}
          />
        )}
      </div>
    );
  }

  // Initial centered layout (before chat expansion)
  return (
    <div className="min-h-screen pt-32 pb-8 px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Centered Layout */}
        <div className="text-center space-y-8">
          
          {/* Prominent Title */}
          <div className="space-y-4">
            <h1 className="title-text-bold text-4xl text-[var(--text-primary)]">
              {isLoading ? loadingMessages[loadingMessageIndex] : "How can I help you stay on-brand?"}
            </h1>
            <p className="body-text text-lg text-[var(--text-secondary)]">
              {isLoading ? "AI magic incoming" : "Check asset compliance, run workflows, generate copy, or simply ask a question about staying on-brand."}
            </p>
          </div>

          {/* Text Input Area */}
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about brand compliance, request a workflow, or generate on-brand copy..."
                className="w-full h-32 p-4 pr-20 border border-[var(--border-default)] rounded-lg bg-[var(--background-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                disabled={isLoading}
              />
              <div className="absolute bottom-3 left-3">
                <IconButton variant="outline" size="comfortable" disabled={isLoading}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </IconButton>
              </div>
              <div className="absolute bottom-3 right-3">
                <IconButton 
                  variant="primary" 
                  size="comfortable"
                  onClick={handleArrowClick}
                  disabled={!prompt.trim() || isLoading}
                >
                  <ArrowRightIcon />
                </IconButton>
              </div>
              
              {/* Loading Overlay on Input */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[var(--accent-primary)] rounded-full border-t-transparent animate-spin mx-auto"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

