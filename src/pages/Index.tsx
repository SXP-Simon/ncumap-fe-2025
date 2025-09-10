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
import { getFreshmenManual } from "@/services/manual";
import { getAllActivities } from "@/services/activity";
import { getCampusMarks } from "@/services/campus";
import { toChatAI } from "@/utils/navigation";

import type { MapMarks } from "@/types/map";

const Index: React.FC = () => {
  const mapRef = useRef<OpenMapRef | null>(null);

  const [marks, setMarks] = useState<MapMarks>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [location] = useState({ x: 115.804362, y: 28.663298 });
  const [isCategoriesSheetShow, setIsCategoriesSheetShow] = useState(false);
  const [isManualShow, setIsManualShow] = useState(false);
  const [isActivitiesSheetShow, setIsActivitiesSheetShow] = useState(false);
  const [schoolCarDialog, setSchoolCarDialog] = useState(false);
  const [schoolCarNumber, setSchoolCarNumber] = useState(0);
  const [manualData, setManualData] = useState<any>(null);
  const [activitiesData, setActivitiesData] = useState<any>(null);
  const [manualList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manualResponse, activitiesResponse, marksResponse] = await Promise.all([
          getFreshmenManual(),
          getAllActivities(),
          getCampusMarks(),
        ]);
        setManualData(manualResponse.data);
        setActivitiesData(activitiesResponse.data);
        const campusMarks = marksResponse.data;
        if (campusMarks) {
          const newCategories = ["全部", "活动", ...Object.keys(campusMarks)];
          setMarks(campusMarks);
          setCategories(newCategories);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const showBottomSheet = (index: string) => {
    setCurrentCategory(Number(index));
    setIsCategoriesSheetShow(true);
  };

  const showManual = () => setIsManualShow(true);
  const toggleCategoriesSheet = (show: boolean) => setIsCategoriesSheetShow(show);
  const toggleManualSheet = (show: boolean) => setIsManualShow(show);
  const toggleActivitiesSheet = (show: boolean) => setIsActivitiesSheetShow(show);
  const toggleSchoolCarDialog = (show: boolean) => setSchoolCarDialog(show);

  const getCurrentMarks = () => {
    if (!marks || Object.keys(marks).length === 0) return [];
    const category = categories[currentCategory];
    return currentCategory === 0
      ? Object.values(marks).flat()
      : marks[category] || [];
  };

  const mapViewToLocation = (locationId: string) => {
    const [groupIndex] = locationId.split("-").map(Number);
    const category = categories[currentCategory];
    const mark = marks[category]?.[groupIndex];
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
    if (!activitiesData || !marks) return [];
    return activitiesData.map((activity: any) => {
      const allMarks = Object.values(marks).flat();
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
      {marks && (
        <div className="absolute z-50 w-full">
          <NavigationTabs
            categories={categories}
            selectedIndex={currentCategory}
            onSelectionChange={(index) => showBottomSheet(index.toString())}
          />
        </div>
      )}

      <div
        className={`h-screen w-full transition-all duration-300 ${
          isCategoriesSheetShow ||
          isManualShow ||
          isActivitiesSheetShow
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
            campusMarks={marks}
            onFeatureSelected={handleFeatureSelected}
          />
        </Suspense>
      </div>

      {marks && (
        <FloatingActionButtons
          onLocationClick={() => mapRef.current?.locate()}
          onManualClick={showManual}
          onSchoolCarClick={() => toggleSchoolCarDialog(true)}
          onChatClick={toChatAI}
        />
      )}

      {isCategoriesSheetShow && (
        <GlassmorphismSelectingSheet
          isOpen={isCategoriesSheetShow}
          onClose={() => toggleCategoriesSheet(false)}
          title="选择地点"
          buildings={getCurrentMarks()}
          selectedCategory={categories[currentCategory] || "全部"}
          onBuildingSelect={(building, index) => {
            const locationId = resolveLocationId(building, index);
            mapViewToLocation(locationId);
            toggleCategoriesSheet(false);
          }}
          emptyMessage="该分类下暂无地点"
        />
      )}

      {isActivitiesSheetShow && (
        <GlassmorphismSelectingSheet
          isOpen={isActivitiesSheetShow}
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

      {isManualShow && manualData && (
        <GlassmorphismSelectingSheet
          isOpen={isManualShow}
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
        isOpen={schoolCarDialog}
        onClose={() => toggleSchoolCarDialog(false)}
        schoolCarNumber={schoolCarNumber.toString()}
        onSchoolCarNumberChange={(value: string) =>
          setSchoolCarNumber(Number(value) || 0)
        }
        onConfirm={() => toggleSchoolCarDialog(false)}
      />
    </div>
  );
};

export default Index;
