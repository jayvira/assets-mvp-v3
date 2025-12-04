"use client";

import React, { createContext, useContext, useState } from 'react';

export interface Locale {
  id: string;
  code: string; // ISO code like "en-US"
  name: string; // Language name like "English"
  country: string; // Country name like "United States"
  displayName: string; // Display name like "English (US)"
  isPrimary: boolean;
  subdirectory?: string; // e.g., "/uk", "/de"
  publishingEnabled: boolean;
  displayImage?: string; // URL for display image
}

interface LocaleContextType {
  currentLocale: Locale;
  locales: Locale[];
  setCurrentLocale: (locale: Locale) => void;
  addLocale: (locale: Omit<Locale, 'id'>) => void;
  updateLocale: (id: string, updates: Partial<Locale>) => void;
  deleteLocale: (id: string) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Default locale data
const defaultLocales: Locale[] = [
  {
    id: '1',
    code: 'en-US',
    name: 'English',
    country: 'United States',
    displayName: 'English (US)',
    isPrimary: true,
    subdirectory: undefined,
    publishingEnabled: true,
  },
  {
    id: '2',
    code: 'en-GB',
    name: 'English',
    country: 'United Kingdom',
    displayName: 'English (UK)',
    isPrimary: false,
    subdirectory: '/uk',
    publishingEnabled: false,
  },
  {
    id: '3',
    code: 'de-DE',
    name: 'Deutsch',
    country: 'Germany',
    displayName: 'Deutsch',
    isPrimary: false,
    subdirectory: '/de',
    publishingEnabled: false,
  },
  {
    id: '4',
    code: 'en-AU',
    name: 'English',
    country: 'Australia',
    displayName: 'English (AU)',
    isPrimary: false,
    subdirectory: '/au',
    publishingEnabled: false,
  },
];

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locales, setLocales] = useState<Locale[]>(defaultLocales);
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    // Get primary locale as default
    return defaultLocales.find(locale => locale.isPrimary) || defaultLocales[0];
  });

  const handleSetCurrentLocale = (locale: Locale) => {
    setCurrentLocale(locale);
  };

  const addLocale = (localeData: Omit<Locale, 'id'>) => {
    const newLocale: Locale = {
      ...localeData,
      id: Date.now().toString(), // Simple ID generation for prototype
    };
    setLocales(prev => [...prev, newLocale]);
  };

  const updateLocale = (id: string, updates: Partial<Locale>) => {
    setLocales(prev =>
      prev.map(locale => {
        if (locale.id === id) {
          return { ...locale, ...updates };
        }
        return locale;
      })
    );
    
    // Update current locale if it's the one being updated
    if (currentLocale.id === id) {
      setCurrentLocale(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteLocale = (id: string) => {
    const localeToDelete = locales.find(l => l.id === id);
    if (localeToDelete?.isPrimary) {
      // Don't allow deleting primary locale
      return;
    }
    
    setLocales(prev => prev.filter(locale => locale.id !== id));
    
    // If current locale is deleted, switch to primary
    if (currentLocale.id === id) {
      const primaryLocale = locales.find(l => l.isPrimary);
      if (primaryLocale) {
        setCurrentLocale(primaryLocale);
      }
    }
  };

  return (
    <LocaleContext.Provider
      value={{
        currentLocale,
        locales,
        setCurrentLocale: handleSetCurrentLocale,
        addLocale,
        updateLocale,
        deleteLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

