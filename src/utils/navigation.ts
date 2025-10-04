import { mincu } from 'mincu-vanilla';

/**
 * 打开外部链接的通用函数
 * 优先使用移动端的 mincu.openUrl，fallback 到 window.open
 * @param url 要打开的链接
 */
export const openExternalUrl = (url: string) => {
  try {
    if (mincu.isApp) {
      (mincu as any).openUrl(url);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    console.error('无法打开外部链接');
  }
};

/**
 * 跳转到漫游指北页面
 */
export const toChatAI = () => {
  openExternalUrl('https://aiguide.ncuos.com/welcome');
};
