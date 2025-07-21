"use client";

import React, { useRef, useEffect } from 'react';
import PanelHeader from './PanelHeader';

interface PanelProps {
  title: string;
  isOpen: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  panelWidth?: string;
  hideHeader?: boolean;
}

const Panel: React.FC<PanelProps> = ({ title, isOpen, children, onClose, panelWidth = '248px', hideHeader = false }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Remove the click-outside behavior entirely
  // The panel will only close via the close button or specific canvas clicks
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={panelRef}
      className="fixed left-[35px] top-[35px] h-[calc(100vh-35px)] bg-[var(--bg-primary)] border-r border-[var(--border-default)] z-10 overflow-hidden flex flex-col"
      style={{
        width: panelWidth,
        boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
        animation: 'panelSlideIn 0.15s ease-out forwards'
      }}
    >
      {!hideHeader && <PanelHeader title={title} onClose={onClose} />}
      <div className="flex-1 panel-content-wrapper">
        <div className="flex-1 w-full panel-content">
          {children || (
            <div className="text-[var(--text-secondary)] body-text flex flex-col gap-2">
              <p>This is the {title} panel.</p>
              <p>Content for this panel will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes panelSlideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* Custom scrollbar styles with absolute positioning */
        .panel-content-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .panel-content {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        
        /* Custom scrollbar styling */
        .panel-content::-webkit-scrollbar {
          width: 8px;
          background-color: transparent;
          position: absolute;
          right: 0;
        }
        
        .panel-content::-webkit-scrollbar-thumb {
          background-color: transparent;
          border-radius: 0px;
          transition: background-color 0.2s ease;
        }
        
        .panel-content:hover::-webkit-scrollbar-thumb {
          background-color: rgba(69, 69, 69, 0.7);
        }
        
        .panel-content::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        /* For Firefox */
        .panel-content {
          scrollbar-width: none; /* Hide the default scrollbar */
        }
        
        /* Add a custom scrollbar for Firefox that doesn't affect layout */
        @-moz-document url-prefix() {
          .panel-content-wrapper:hover::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            background-color: rgba(69, 69, 69, 0.7);
            z-index: 100;
            opacity: 0.7;
            border-radius: 0px;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Panel; 