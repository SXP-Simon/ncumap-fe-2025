import type { UIActions, PageLogicParams, MapData } from './types';

/**
 * UI 控制相关的 hook
 * 处理所有 UI 状态的切换和控制逻辑
 */
export function useUIActions(
  { mapRef }: PageLogicParams, 
  ui: ReturnType<typeof import('./useUIState').useUIState>, 
  map: MapData,
  setMap: (value: MapData | ((prev: MapData) => MapData)) => void
): UIActions {

  const showBottomSheet = (currentCategory: string) => {
    const categoryIndex = parseInt(currentCategory);
    
    ui.setSchoolCarDialog(false);
    ui.setBottomSheetSelected(-1);
    ui.setIsManualShow(false);

    if (categoryIndex === 0 || categoryIndex === 1) {
      ui.setIsCategoriesSheetShow(false);
      ui.setIsActivitiesSheetShow(false);
      if (categoryIndex === 1) {
        ui.setIsActivitiesSheetShow(true);
      }
    } else {
      ui.setIsCategoriesSheetShow(true);
      ui.setIsActivitiesSheetShow(false);
    }

    setMap(prev => ({ ...prev, currentCategory: categoryIndex }));
  };
  
  const showManual = () => {
    ui.setBottomSheetSelected(-1);
    if (mapRef.current) {
      mapRef.current.showAllMarks();
    }
    ui.setIsCategoriesSheetShow(false);
    ui.setIsManualShow(true);
  };
  
  const bottomSheetSelect = (index: number) => {
    ui.setBottomSheetSelected(index);
    if (mapRef.current && map.marks) {
      const selectedMark = map.marks[map.categories[map.currentCategory]][index];
      mapRef.current.viewTo(selectedMark.coordinates);
      const markZoom = selectedMark.priority;
      mapRef.current.zoomTo(3 > markZoom ? 3 : markZoom);
    }
  };

  return {
    showBottomSheet,
    showManual,
    bottomSheetSelect,
    toggleCategoriesSheet: ui.setIsCategoriesSheetShow,
    toggleManualSheet: ui.setIsManualShow,
    toggleActivitiesSheet: ui.setIsActivitiesSheetShow,
    toggleSchoolCarDialog: ui.setSchoolCarDialog,
    setSchoolCarNumber: ui.setSchoolCarNumber,
    setBottomSheetSelected: ui.setBottomSheetSelected,
  };
}
