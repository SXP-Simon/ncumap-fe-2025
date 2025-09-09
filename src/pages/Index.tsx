import { useRef, Suspense, useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import OpenMap, { type OpenMapRef } from "@/components/OpenMap";
import {
  NavigationTabs,
  SchoolCarModal,
  GlassmorphismSelectingSheet,
  FloatingActionButtons,
} from "@/components/ui";
import { resolveLocationId } from "@/utils/location";
import { getCampusManual } from "@/services/manual";
import { getCampusActivities } from "@/services/activity";
import { useFetchData } from "@/hooks/useFetchData";
import { toChatAI } from "@/utils/navigation";

import type { MapMarks } from "@/hooks/types";

interface MapState {
  marks: MapMarks;
  categories: string[];
  currentCategory: number;
}

interface UIState {
  isCategoriesSheetShow: boolean;
  isManualShow: boolean;
  isActivitiesSheetShow: boolean;
  schoolCarDialog: boolean;
  schoolCarNumber: number;
}

const Index: React.FC = () => {
  const mapRef = useRef<OpenMapRef | null>(null);

  const [map, setMap] = useState<MapState>({
    marks: {},
    categories: [],
    currentCategory: 0,
  });
  const [location] = useState({ x: 115.804362, y: 28.663298 });
  const [ui, setUI] = useState<UIState>({
    isCategoriesSheetShow: false,
    isManualShow: false,
    isActivitiesSheetShow: false,
    schoolCarDialog: false,
    schoolCarNumber: 0,
  });
  const [manualData, setManualData] = useState<any>(null);
  const [activitiesData, setActivitiesData] = useState<any>(null);
  const [manualList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manualResponse, activitiesResponse] = await Promise.all([
          getCampusManual(),
          getCampusActivities(),
        ]);
        setManualData(manualResponse.data);
        setActivitiesData(activitiesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const { campusMarks } = useFetchData();

  useEffect(() => {
    if (!campusMarks) return;
    const categories = ["全部", "活动", ...Object.keys(campusMarks)];
    setMap((prev) => ({ ...prev, marks: campusMarks, categories }));
  }, [campusMarks]);

  const showBottomSheet = (index: string) => {
    setMap((prev) => ({ ...prev, currentCategory: Number(index) }));
    setUI((prev) => ({ ...prev, isCategoriesSheetShow: true }));
  };

  const showManual = () => setUI((prev) => ({ ...prev, isManualShow: true }));
  const toggleCategoriesSheet = (show: boolean) =>
    setUI((prev) => ({ ...prev, isCategoriesSheetShow: show }));
  const toggleManualSheet = (show: boolean) =>
    setUI((prev) => ({ ...prev, isManualShow: show }));
  const toggleActivitiesSheet = (show: boolean) =>
    setUI((prev) => ({ ...prev, isActivitiesSheetShow: show }));
  const toggleSchoolCarDialog = (show: boolean) =>
    setUI((prev) => ({ ...prev, schoolCarDialog: show }));
  const setSchoolCarNumber = (number: number) =>
    setUI((prev) => ({ ...prev, schoolCarNumber: number }));

  const getCurrentMarks = () => {
    if (!map.marks || Object.keys(map.marks).length === 0) return [];
    const category = map.categories[map.currentCategory];
    return map.currentCategory === 0
      ? Object.values(map.marks).flat()
      : map.marks[category] || [];
  };

  const mapViewToLocation = (locationId: string) => {
    const [groupIndex] = locationId.split("-").map(Number);
    const category = map.categories[map.currentCategory];
    const mark = map.marks[category]?.[groupIndex];
    if (mark && mapRef.current && mark.coordinates) {
      mapRef.current.viewTo(mark.coordinates);
    }
  };

  const handleFeatureSelected = (locationId: string) => {
    window.location.href = `/${locationId}`;
  };

  const manualSelectOnly = (index: number, groupIndex: number) => {
    if (manualData && manualData[groupIndex]) {
      const item = manualData[groupIndex].items[index];
      if (item && item.location_id) {
        handleFeatureSelected(item.location_id);
      }
    }
  };

  const getActivitiesList = () => {
    if (!activitiesData || !map.marks) return [];
    return activitiesData.map((activity: any) => {
      const allMarks = Object.values(map.marks).flat();
      const mark = allMarks.find(
        (m: any) => m.location_id === activity.location_id
      );
      return {
        ...activity,
        name: activity.title,
        category: "校园活动",
        coordinates: mark?.coordinates,
      };
    });
  };

  const activities = getActivitiesList();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {map.marks && (
        <div className="absolute z-50 w-full">
          <NavigationTabs
            categories={map.categories}
            selectedIndex={map.currentCategory}
            onSelectionChange={(index) => showBottomSheet(index.toString())}
          />
        </div>
      )}

      <div
        className={`h-screen w-full transition-all duration-300 ${
          ui.isCategoriesSheetShow ||
          ui.isManualShow ||
          ui.isActivitiesSheetShow
            ? "h-1/2"
            : ""
        }`}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <Spinner size="lg" color="primary" />
            </div>
          }
        >
          <OpenMap
            ref={mapRef}
            x={location.x}
            y={location.y}
            onFeatureSelected={handleFeatureSelected}
          />
        </Suspense>
      </div>

      {map.marks && (
        <FloatingActionButtons
          onLocationClick={() => mapRef.current?.locate()}
          onManualClick={showManual}
          onSchoolCarClick={() => toggleSchoolCarDialog(true)}
          onChatClick={toChatAI}
        />
      )}

      {ui.isCategoriesSheetShow && (
        <GlassmorphismSelectingSheet
          isOpen={ui.isCategoriesSheetShow}
          onClose={() => toggleCategoriesSheet(false)}
          title="选择地点"
          buildings={getCurrentMarks()}
          selectedCategory={map.categories[map.currentCategory] || "全部"}
          onBuildingSelect={(building, index) => {
            const locationId = resolveLocationId(building, index);
            mapViewToLocation(locationId);
            toggleCategoriesSheet(false);
          }}
          emptyMessage="该分类下暂无地点"
        />
      )}

      {ui.isActivitiesSheetShow && (
        <GlassmorphismSelectingSheet
          isOpen={ui.isActivitiesSheetShow}
          onClose={() => toggleActivitiesSheet(false)}
          title="校园活动"
          buildings={activities.length ? activities : []}
          onBuildingSelect={(building) => {
            toggleActivitiesSheet(false);
            const buildingId = resolveLocationId(building);
            handleFeatureSelected(String(buildingId));
          }}
          selectedCategory="校园活动"
          emptyMessage="暂无活动数据"
        />
      )}

      {ui.isManualShow && manualData && (
        <GlassmorphismSelectingSheet
          isOpen={ui.isManualShow}
          onClose={() => toggleManualSheet(false)}
          title="新生手册"
          buildings={manualList}
          onBuildingSelect={(building) => {
            const buildingId = resolveLocationId(building);
            const [gi, idx] = String(buildingId)
              .split("-")
              .map((v) => Number(v));
            manualSelectOnly(idx, gi);
          }}
          selectedCategory="新生手册"
          emptyMessage="暂无手册数据"
        />
      )}

      <SchoolCarModal
        isOpen={ui.schoolCarDialog}
        onClose={() => toggleSchoolCarDialog(false)}
        schoolCarNumber={ui.schoolCarNumber.toString()}
        onSchoolCarNumberChange={(value: string) =>
          setSchoolCarNumber(Number(value) || 0)
        }
        onConfirm={() => toggleSchoolCarDialog(false)}
      />
    </div>
  );
};

export default Index;
