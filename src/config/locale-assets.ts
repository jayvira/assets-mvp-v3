// Locale-specific asset URLs
// Maps locale codes to their corresponding homepage image URLs
export const LOCALE_HOMEPAGE_IMAGES: Record<string, string> = {
  'en-US': 'https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687dbb91da28da0f49ea92ed_Screenshot%202025-07-20%20at%204.27.59%E2%80%AFPM.png', // English version
  'en-GB': 'https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687dbb91da28da0f49ea92ed_Screenshot%202025-07-20%20at%204.27.59%E2%80%AFPM.png', // UK version (can be same or different)
  'de-DE': 'https://cdn.prod.website-files.com/67aa7a0117b5fe3c0cf4ad45/69320f44204861dc4b726afd_unnamed.jpg', // German version
  'en-AU': 'https://cdn.prod.website-files.com/687d379371b4f02fa4f58460/687dbb91da28da0f49ea92ed_Screenshot%202025-07-20%20at%204.27.59%E2%80%AFPM.png', // Australian version
};

// Helper function to get homepage image for a locale
export function getHomepageImageForLocale(localeCode: string): string {
  const imageUrl = LOCALE_HOMEPAGE_IMAGES[localeCode];
  // If locale has no image or empty string, fallback to English (en-US)
  if (!imageUrl) {
    return LOCALE_HOMEPAGE_IMAGES['en-US'] || '';
  }
  return imageUrl;
}

