import { useNavigate } from 'react-router-dom';
import { useManual } from './useManual';
import { toChatAI as navigateToChatAI } from '../utils/navigation';
import type { NavigationActions, PageLogicParams, ManualData } from './types';

/**
 * 导航相关的 hook
 * 处理所有导航跳转和外部链接操作
 */
export function useNavigationActions({ mapRef }: PageLogicParams, manualData: ManualData | null): NavigationActions {
  const navigate = useNavigate();
  const manual = useManual(mapRef, manualData);

  const handleFeatureSelected = (locationId: string) => {
    navigate(`/${locationId}`);
  };

  return {
    manualRedirect: manual.manualRedirect,
    manualSelect: manual.manualSelect,
    manualSelectOnly: manual.manualSelectOnly,
    toChatAI: navigateToChatAI,
    handleFeatureSelected,
  };
}
