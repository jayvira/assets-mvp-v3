"use client";

import React, { useState } from 'react';
import { useLocale, Locale } from '@/context/LocaleContext';
import { Button } from '@/components/spring-ui/button';
import { Input } from '@/components/spring-ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/spring-ui/select';
import { Switch } from '@/components/spring-ui/switch';
import { ChevronSmallDownIcon, ChevronSmallUpIcon, CheckDefaultIcon, CloseDefaultIcon } from '@/icons';
import { Row } from '@/components/spring-ui/row';

interface LocalizationPanelProps {
  onBack: () => void;
}

// Language and country options (simplified for prototype)
const languages = [
  'English',
  'Deutsch',
  'Français',
  'Español',
  'Italiano',
  'Português',
  '日本語',
  '中文',
];

const countries = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Australia',
  'Canada',
  'Japan',
  'China',
];

const LocalizationPanel: React.FC<LocalizationPanelProps> = ({ onBack }) => {
  const { locales, addLocale, updateLocale, currentLocale } = useLocale();
  const [expandedLocaleId, setExpandedLocaleId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLocale, setNewLocale] = useState<Partial<Locale>>({
    name: 'English',
    country: 'United States',
    displayName: '',
    code: '',
    isPrimary: false,
    subdirectory: '',
    publishingEnabled: false,
  });

  const toggleExpand = (localeId: string) => {
    setExpandedLocaleId(expandedLocaleId === localeId ? null : localeId);
  };

  const handleAddNewLocale = () => {
    if (!newLocale.name || !newLocale.country || !newLocale.displayName) {
      return;
    }
    
    // Generate ISO code from name and country
    const code = `${newLocale.name.substring(0, 2).toLowerCase()}-${newLocale.country.substring(0, 2).toUpperCase()}`;
    
    addLocale({
      name: newLocale.name!,
      country: newLocale.country!,
      displayName: newLocale.displayName!,
      code: code,
      isPrimary: false,
      subdirectory: newLocale.subdirectory || undefined,
      publishingEnabled: newLocale.publishingEnabled || false,
    });
    
    // Reset form
    setNewLocale({
      name: 'English',
      country: 'United States',
      displayName: '',
      code: '',
      isPrimary: false,
      subdirectory: '',
      publishingEnabled: false,
    });
    setIsAddingNew(false);
  };

  const handleUpdateLocale = (id: string, field: keyof Locale, value: any) => {
    updateLocale(id, { [field]: value });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-2 py-3 flex items-center justify-between border-b border-[var(--border-default)]">
        <h2 className="title-text-bold">Localization</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="compact" onClick={onBack}>
            Cancel
          </Button>
          <Button variant="primary" size="compact">
            Save changes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Supported locales section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="body-text-bold text-[var(--text-primary)]">Supported locales</h3>
            {!isAddingNew && (
              <Button 
                variant="ghost" 
                size="compact"
                onClick={() => setIsAddingNew(true)}
              >
                + Add new locale
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="border border-[var(--border-default)] rounded-md overflow-hidden">
            {/* Table Header */}
            <div className="flex w-full bg-[var(--bg-secondary)] border-b border-[var(--border-default)]">
              <div className="flex-1 py-2.5 px-3 body-text-bold">Locale</div>
              <div className="w-40 py-2.5 pl-6 pr-3 body-text-bold flex items-center justify-center">ISO Code</div>
              <div className="w-48 py-2.5 px-3 body-text-bold flex items-center justify-center">Subdirectory</div>
              <div className="w-36 py-2.5 px-3 body-text-bold flex items-center justify-center">Publishing</div>
              <div className="w-12 py-2.5 px-3"></div>
            </div>

            {/* Table Rows */}
            {locales.map((locale) => (
              <div key={locale.id}>
                {/* Main Row */}
                <div 
                  className="flex w-full border-b border-[var(--border-default)] cursor-pointer hover:bg-[var(--bg-raised)]"
                  onClick={() => toggleExpand(locale.id)}
                >
                  <div className="flex-1 py-2.5 px-3 flex items-center gap-2">
                    <span className="body-text">{locale.displayName}</span>
                    {locale.isPrimary && (
                      <span className="text-xs px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="w-40 py-2.5 pl-6 pr-3 body-text flex items-center justify-center">
                    {locale.code}
                  </div>
                  <div className="w-48 py-2.5 px-3 body-text text-[var(--text-secondary)] flex items-center justify-center">
                    {locale.subdirectory || ''}
                  </div>
                  <div className="w-36 py-2.5 px-3 flex items-center justify-center">
                    {locale.publishingEnabled ? (
                      <CheckDefaultIcon size={16} className="text-[var(--text-green)]" />
                    ) : (
                      <CloseDefaultIcon size={16} className="text-[var(--text-secondary)] opacity-50" />
                    )}
                  </div>
                  <div className="w-12 py-2.5 px-3 flex items-center justify-center">
                    {expandedLocaleId === locale.id ? (
                      <ChevronSmallUpIcon size={16} className="text-[var(--text-secondary)]" />
                    ) : (
                      <ChevronSmallDownIcon size={16} className="text-[var(--text-secondary)]" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedLocaleId === locale.id && (
                  <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-default)] p-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                        Language*
                      </label>
                      <Select
                        value={locale.name}
                        onValueChange={(value) => handleUpdateLocale(locale.id, 'name', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                        Country
                      </label>
                      <Select
                        value={locale.country}
                        onValueChange={(value) => handleUpdateLocale(locale.id, 'country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                        Display name*
                      </label>
                      <Input
                        value={locale.displayName}
                        onChange={(e) => handleUpdateLocale(locale.id, 'displayName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                        Subdirectory for this locale*
                      </label>
                      <Input
                        value={locale.subdirectory || ''}
                        onChange={(e) => handleUpdateLocale(locale.id, 'subdirectory', e.target.value || undefined)}
                        placeholder="e.g., /uk"
                      />
                      {locale.subdirectory && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          website.com{locale.subdirectory}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                          Enable publishing to the subdirectory
                        </label>
                      </div>
                      <Switch
                        checked={locale.publishingEnabled}
                        onChange={(e) => handleUpdateLocale(locale.id, 'publishingEnabled', e.target.checked)}
                        sizeVariant="compact"
                        hideLabel
                      />
                    </div>

                    {!locale.publishingEnabled && (
                      <div className="p-3 bg-[var(--green-bg-transparent)] rounded border border-[var(--green-bg)]">
                        <p className="text-xs text-[var(--text-green)]">
                          You are using a limited Localization preview. To publish this locale, please contact your Webflow Account Team or reach out to Support via the portal to add Localization to your Enterprise Site plan.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add New Locale Row */}
            {isAddingNew && (
              <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-default)] p-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                    Language*
                  </label>
                  <Select
                    value={newLocale.name}
                    onValueChange={(value) => setNewLocale({ ...newLocale, name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                    Country
                  </label>
                  <Select
                    value={newLocale.country}
                    onValueChange={(value) => setNewLocale({ ...newLocale, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                    Display name*
                  </label>
                  <Input
                    value={newLocale.displayName}
                    onChange={(e) => setNewLocale({ ...newLocale, displayName: e.target.value })}
                    placeholder="e.g., English (UK)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                    Subdirectory for this locale*
                  </label>
                  <Input
                    value={newLocale.subdirectory || ''}
                    onChange={(e) => setNewLocale({ ...newLocale, subdirectory: e.target.value })}
                    placeholder="e.g., /uk"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                      Enable publishing to the subdirectory
                    </label>
                  </div>
                  <Switch
                    checked={newLocale.publishingEnabled || false}
                    onChange={(e) => setNewLocale({ ...newLocale, publishingEnabled: e.target.checked })}
                    sizeVariant="compact"
                    hideLabel
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="primary" 
                    size="compact"
                    onClick={handleAddNewLocale}
                  >
                    Add locale
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="compact"
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewLocale({
                        name: 'English',
                        country: 'United States',
                        displayName: '',
                        code: '',
                        isPrimary: false,
                        subdirectory: '',
                        publishingEnabled: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* URL Routing Section */}
        <div className="mb-6">
          <h3 className="body-text-bold text-[var(--text-primary)] mb-2">URL routing</h3>
          <p className="text-xs text-[var(--text-secondary)] mb-2">
            Automatically route visitors by browser preference
          </p>
          <Switch checked={false} sizeVariant="compact" />
        </div>

        {/* SEO Section */}
        <div className="mb-6">
          <h3 className="body-text-bold text-[var(--text-primary)] mb-2">SEO</h3>
          <p className="text-xs text-[var(--text-secondary)] mb-2">
            Automatically generate hreflang tags for your pages.
          </p>
          <div className="space-y-2">
            <Switch checked={true} sizeVariant="compact" />
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <label className="text-xs text-[var(--text-primary)]">
                Same as published or canonical url
              </label>
            </div>
          </div>
        </div>

        {/* Custom Translation Terminology Section */}
        <div>
          <h3 className="body-text-bold text-[var(--text-primary)] mb-2">Custom translation terminology</h3>
          <p className="text-xs text-[var(--text-secondary)] mb-2">
            Upload a .csv file to override translations for specific words and phrases.
          </p>
          <div className="border-2 border-dashed border-[var(--border-default)] rounded-md p-8 text-center">
            <div className="text-[var(--text-secondary)] mb-2">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a2 2 0 00-2.828-2.828L9 10.586 4.828 6.414a2 2 0 10-2.828 2.828L6.172 13.414l-2.172 2.172a2 2 0 102.828 2.828L9 16.242l6.586-6.586a2 2 0 00-2.828-2.828z" />
              </svg>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">
              Drag your file here
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              or click to browse for a file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalizationPanel;

