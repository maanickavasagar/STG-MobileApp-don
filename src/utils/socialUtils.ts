/**
 * Utility functions for formatting social media handles and usernames
 * Strips out full URLs (https://www.instagram.com/..., https://youtube.com/...)
 * and returns only the clean account username or channel name.
 */

export const formatSocialHandle = (
  network: 'instagram' | 'youtube' | 'discord' | 'website' | string,
  rawVal: string,
  includeAtForInstagram = false
): string => {
  if (!rawVal || typeof rawVal !== 'string') return '';
  let str = rawVal.trim();

  // If already a clean handle with no url/domain
  const hasDomain = /https?:\/\/|www\.|\.com|\.gg|\.be|\.in|\.net/i.test(str);
  if (!hasDomain) {
    const clean = str.replace(/^@+/, '').trim();
    if (network === 'instagram' && includeAtForInstagram) {
      return clean ? `@${clean}` : '';
    }
    return clean;
  }

  // Remove protocol and www
  str = str.replace(/^https?:\/\/(www\.)?/i, '');

  if (network === 'instagram' || /instagram\.com/i.test(str)) {
    str = str.replace(/^instagram\.com\/?/i, '');
    str = str.replace(/^\/?(@|\?|#|\/)?/, '');
    // Take the path segment before any query parameter, hash, or trailing slash
    str = str.split('/')[0].split('?')[0].split('#')[0].trim();
    str = str.replace(/^@+/, '');
    return includeAtForInstagram ? (str ? `@${str}` : '') : str;
  }

  if (network === 'youtube' || /youtube\.com|youtu\.be/i.test(str)) {
    str = str.replace(/^(youtube\.com|youtu\.be)\/?/i, '');
    str = str.replace(/^(c\/|channel\/|user\/|@)?/i, '');
    str = str.split('/')[0].split('?')[0].split('#')[0].trim();
    str = str.replace(/^@+/, '');
    return str;
  }

  if (network === 'discord' || /discord\.gg|discord\.com/i.test(str)) {
    str = str.replace(/^(discord\.gg|discord\.com\/invite)\/?/i, '');
    str = str.split('/')[0].split('?')[0].split('#')[0].trim();
    return str;
  }

  // General website or fallback
  str = str.split('/')[0].split('?')[0].trim();
  return str;
};
