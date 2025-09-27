import { mincu } from 'mincu-vanilla';

/**
 * 打开外部链接的通用函数
 * 优先使用移动端的 mincu.openUrl，fallback 到 window.open
 * @param url 要打开的链接
 */
export const openExternalUrl = (url: string) => {
  try {
    // 优先使用移动端的 mincu.openUrl
    if (mincu && typeof (mincu as any).openUrl === 'function') {
      (mincu as any).openUrl(url);
      return;
    }
  } catch {
    // ignore and fallback to window.open
  }

  // Fallback for web: open in new tab
  if (typeof window !== 'undefined' && window.open) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

/**
 * 跳转到漫游指北页面
 */
export const toChatAI = () => {
  openExternalUrl('https://aiguide.ncuos.com/welcome');
};
