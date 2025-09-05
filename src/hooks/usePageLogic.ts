import { useMapState } from './useMapState';
import { useFetchData } from './useFetchData';
import { useUIState } from './useUIState';
import { useManual } from './useManual';
import { useActivities } from './useActivities';
import { mincu } from 'mincu-vanilla';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { OpenMapRef } from '../components/OpenMap';

export function usePageLogic(mapRef: React.RefObject<OpenMapRef | null>) {
  const { map, setMap, updateFromRef, getCurrentMarks } = useMapState(mapRef);
  const { manualData, activitiesData } = useFetchData();
  const ui = useUIState();
  const manual = useManual(mapRef, manualData);
  const activitiesList = useActivities(activitiesData, map.marks);
  const navigate = useNavigate();

  // 添加 useEffect 来同步地图数据
  useEffect(() => {
    updateFromRef();
  }, [manualData, activitiesData, updateFromRef]);

  // expose previous API shape (delegating to smaller hooks)
  return {
    map,
    setMap,
    location: { x: 115.804362, y: 28.663298 },
    isCategoriesSheetShow: ui.isCategoriesSheetShow,
    setIsCategoriesSheetShow: ui.setIsCategoriesSheetShow,
    isManualShow: ui.isManualShow,
    setIsManualShow: ui.setIsManualShow,
    isActivitiesSheetShow: ui.isActivitiesSheetShow,
    setIsActivitiesSheetShow: ui.setIsActivitiesSheetShow,
    schoolCarDialog: ui.schoolCarDialog,
    setSchoolCarDialog: ui.setSchoolCarDialog,
    schoolCarNumber: ui.schoolCarNumber,
    setSchoolCarNumber: ui.setSchoolCarNumber,
    bottomSheetSelected: ui.bottomSheetSelected,
    setBottomSheetSelected: ui.setBottomSheetSelected,
    manualData,
    activitiesData,
    manualGroupIndex: manual.manualGroupIndex,
    manualSelectedIndex: manual.manualSelectedIndex,
    showBottomSheet: (currentCategory: string) => {
      const categoryIndex = parseInt(currentCategory);
      ui.setSchoolCarDialog(false);
      ui.setBottomSheetSelected(-1);
      ui.setIsManualShow(false);

      if (categoryIndex === 0 || categoryIndex === 1) {
        ui.setIsCategoriesSheetShow(false);
        ui.setIsActivitiesSheetShow(false);
        if (categoryIndex === 1) ui.setIsActivitiesSheetShow(true);
      } else {
        ui.setIsCategoriesSheetShow(true);
        ui.setIsActivitiesSheetShow(false);
      }

      setMap(prev => ({ ...prev, currentCategory: categoryIndex }));
    },
    showManual: () => {
      ui.setBottomSheetSelected(-1);
      if (mapRef.current) mapRef.current.showAllMarks();
      ui.setIsCategoriesSheetShow(false);
      ui.setIsManualShow(true);
    },
    bottomSheetSelect: (index: number) => {
      ui.setBottomSheetSelected(index);
      if (mapRef.current && map.marks) {
        const selectedMark = map.marks[map.categories[map.currentCategory]][index];
        mapRef.current.viewTo(selectedMark.coordinates);
        const markZoom = selectedMark.priority;
        mapRef.current.zoomTo(3 > markZoom ? 3 : markZoom);
      }
    },
    manualRedirect: manual.manualRedirect,
    manualSelect: manual.manualSelect,
    toChatAI: () => {
      const url = 'https://aiguide.ncuos.com/welcome';
      try {
        if (mincu && typeof (mincu as any).openUrl === 'function') {
          (mincu as any).openUrl(url);
          return;
        }
      } catch (e) {
        // fallback
      }

      if (typeof window !== 'undefined' && window.open) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    handleFeatureSelected: (locationId: string) => {
      navigate(`/${locationId}`);
    },
    getCurrentMarks,
    getActivitiesList: () => activitiesList,
    updateFromRef,
  };
}
