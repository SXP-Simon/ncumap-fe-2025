import { useEffect } from 'react';
import { useMapState } from './useMapState';
import { useFetchData } from './useFetchData';
import { useUIState } from './useUIState';
import { useManual } from './useManual';
import { useMapActions } from './useMapActions';
import { useUIActions } from './useUIActions';
import { useNavigationActions } from './useNavigationActions';
import { useDataActions } from './useDataActions';
import type { 
  PageLogicActions, 
  PageLogicState, 
  PageLogicParams 
} from './types';
import type { OpenMapRef } from '../components/OpenMap';

/**
 * 页面逻辑组合 hook
 * 将所有子 hooks 组合在一起，提供统一的接口
 * 
 * 这个 hook 的职责：
 * 1. 组合各个功能域的 hooks
 * 2. 处理跨域的数据依赖和同步
 * 3. 提供统一的 API 给组件使用
 */
export function usePageLogic(mapRef: React.RefObject<OpenMapRef | null>) {
  // 基础数据层
  const { map, updateFromRef, setMap, getCurrentMarks } = useMapState(mapRef);
  const { manualData, activitiesData } = useFetchData();
  const ui = useUIState();
  const manual = useManual(mapRef, manualData);

  // 参数对象
  const params: PageLogicParams = { mapRef };

  // 功能域 hooks
  const mapActions = useMapActions(setMap, updateFromRef, getCurrentMarks);
  const uiActions = useUIActions(params, ui, map, setMap);
  const navigationActions = useNavigationActions(params, manualData);
  const dataActions = useDataActions(activitiesData, map.marks);

  // 跨域数据同步
  useEffect(() => {
    updateFromRef();
  }, [manualData, activitiesData, updateFromRef]);

  // 组织状态
  const state: PageLogicState = {
    map,
    location: { x: 115.804362, y: 28.663298 },
    ui: {
      isCategoriesSheetShow: ui.isCategoriesSheetShow,
      isManualShow: ui.isManualShow,
      isActivitiesSheetShow: ui.isActivitiesSheetShow,
      schoolCarDialog: ui.schoolCarDialog,
      schoolCarNumber: ui.schoolCarNumber,
      bottomSheetSelected: ui.bottomSheetSelected,
    },
    data: {
      manualData,
      activitiesData,
      manualGroupIndex: manual.manualGroupIndex,
      manualSelectedIndex: manual.manualSelectedIndex,
    },
  };

  // 组合动作
  const actions: PageLogicActions = {
    mapActions,
    uiActions,
    navigationActions,
    dataActions,
  };

  return {
    ...actions,
    state,
  };
}
