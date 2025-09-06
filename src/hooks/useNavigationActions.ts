import { useNavigate } from 'react-router-dom';
import { useManual } from './useManual';
import { mincu } from 'mincu-vanilla';
import type { NavigationActions, PageLogicParams, ManualData } from './types';

/**
 * 导航相关的 hook
 * 处理所有导航跳转和外部链接操作
 */
export function useNavigationActions({ mapRef }: PageLogicParams, manualData: ManualData | null): NavigationActions {
  const navigate = useNavigate();
  const manual = useManual(mapRef, manualData);

  const toChatAI = () => {
    const url = "https://aiguide.ncuos.com/welcome";
    try {
      if (mincu && typeof (mincu as any).openUrl === 'function') {
        (mincu as any).openUrl(url);
        return;
      }
    } catch (e) {
      // ignore and fallback to window.open
    }
    // Fallback for web: open in new tab
    if (typeof window !== 'undefined' && window.open) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  
  const handleFeatureSelected = (locationId: string) => {
    navigate(`/${locationId}`);
  };

  return {
    manualRedirect: manual.manualRedirect,
    manualSelect: manual.manualSelect,
    manualSelectOnly: manual.manualSelectOnly,
    toChatAI,
    handleFeatureSelected,
  };
}
