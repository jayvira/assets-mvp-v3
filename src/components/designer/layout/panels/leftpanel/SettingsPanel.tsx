"use client";

import React from 'react';
import { Row } from '@/components/spring-ui/row';
import { ToolbarSearch24Icon } from '@/icons/ToolbarSearch24Icon';
import { BackupsIcon } from '@/icons';
import { LocalizationIcon } from '@/icons';

interface SettingsPanelProps {
  onNavigateToLocalization: () => void;
  showLocalization: boolean;
  onBack: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  onNavigateToLocalization, 
  showLocalization,
  onBack 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <Row
          label="Search"
          icon={<ToolbarSearch24Icon size={16} style={{ color: 'var(--text-secondary)' }} />}
          size="compact"
          className="cursor-pointer"
        />
        <Row
          label="GSAP"
          icon={<div className="w-4 h-4 flex items-center justify-center text-[var(--text-secondary)]">G</div>}
          size="compact"
          className="cursor-pointer"
        />
        <Row
          label="Interface"
          icon={<div className="w-4 h-4 flex items-center justify-center text-[var(--text-secondary)]">I</div>}
          size="compact"
          className="cursor-pointer"
        />
        <Row
          label="Backups"
          icon={<BackupsIcon size={16} style={{ color: 'var(--text-secondary)' }} />}
          size="compact"
          className="cursor-pointer"
        />
        <Row
          label="Localization"
          icon={<LocalizationIcon size={16} style={{ color: 'var(--text-secondary)' }} />}
          size="compact"
          selected={showLocalization}
          showChevron={showLocalization}
          className="cursor-pointer"
          onClick={onNavigateToLocalization}
        />
      </div>
    </div>
  );
};

export default SettingsPanel;

