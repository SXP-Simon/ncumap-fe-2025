import { useRef, useState, useEffect } from "react";
import OpenMap, { type OpenMapRef } from "@/components/OpenMap";
import {
  NavigationTabs,
  SchoolCarModal,
  CategoriesDrawer,
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
  const [drawerType, setDrawerType] = useState<
    "location" | "activity" | "manual" | null
  >(null);
  const [schoolCarDialog, setSchoolCarDialog] = useState(false);
  const [schoolCarNumber, setSchoolCarNumber] = useState(0);
  const [manualData, setManualData] = useState<any>(null);
  const [activitiesData, setActivitiesData] = useState<any>(null);
  const [manualList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manualResponse, activitiesResponse, marksResponse] =
          await Promise.all([
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

  const getDrawerTitle = (
    type: "location" | "activity" | "manual" | null
  ): string => {
    switch (type) {
      case "location":
        return "选择地点";
      case "activity":
        return "校园活动";
      case "manual":
        return "新生手册";
      default:
        return "";
    }
  };

  const getDrawerBuildings = (
    type: "location" | "activity" | "manual" | null
  ) => {
    switch (type) {
      case "location":
        return getCurrentMarks();
      case "activity":
        return activities.length ? activities : [];
      case "manual":
        return manualList;
      default:
        return [];
    }
  };

  const getDrawerCategory = (
    type: "location" | "activity" | "manual" | null
  ): string => {
    switch (type) {
      case "location":
        return categories[currentCategory] || "全部";
      case "activity":
        return "校园活动";
      case "manual":
        return "新生手册";
      default:
        return "";
    }
  };

  const toggleDrawer = (type: "location" | "activity" | "manual" | null) => {
    setDrawerType(type);
  };

  const showBottomSheet = (index: string) => {
    const categoryIndex = Number(index);
    setCurrentCategory(categoryIndex);
    toggleDrawer(categoryIndex === 1 ? "activity" : "location");
  };

  const showManual = () => toggleDrawer("manual");
  const toggleSchoolCarDialog = (show: boolean) => setSchoolCarDialog(show);

  const getCurrentMarks = () => {
    if (!marks || Object.keys(marks).length === 0) return [];
    const category = categories[currentCategory];
    return currentCategory === 0
      ? Object.values(marks).flat()
      : marks[category] || [];
  };

  const mapViewToLocation = (locationId: string) => {
    const allMarks = Object.values(marks).flat();
    const mark = allMarks.find((mark) => mark.location_id === locationId);

    if (mark?.coordinates && mapRef.current) {
      mapRef.current.viewTo(mark.coordinates);
    }
  };

  const handleFeatureSelected = (locationId: string) => {
    window.location.href = `/${locationId}`;
  };

  const handleDrawerItemSelect = (
    type: "location" | "activity" | "manual",
    building: any,
    index: number
  ) => {
    switch (type) {
      case "location":
        const locationId = resolveLocationId(building, index);
        mapViewToLocation(locationId);
        toggleDrawer(null);
        break;
      case "activity":
        const activityId = resolveLocationId(building);
        handleFeatureSelected(String(activityId));
        toggleDrawer(null);
        break;
      case "manual":
        const buildingId = resolveLocationId(building);
        const [gi, idx] = String(buildingId)
          .split("-")
          .map((v) => Number(v));
        if (manualData && manualData[gi]) {
          const item = manualData[gi].items[idx];
          if (item && item.location_id) {
            handleFeatureSelected(item.location_id);
          }
        }
        toggleDrawer(null);
        break;
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
      <div className="absolute z-50 w-full">
        <NavigationTabs
          categories={categories}
          selectedIndex={currentCategory}
          onSelectionChange={(index) => showBottomSheet(index.toString())}
        />
      </div>

      <div
        className={`h-screen w-full transition-all duration-300 ${
          drawerType !== null ? "h-1/2" : ""
        }`}
      >
        <OpenMap
          ref={mapRef}
          x={location.x}
          y={location.y}
          campusMarks={marks}
          onFeatureSelected={handleFeatureSelected}
        />
      </div>

      <FloatingActionButtons
        onLocationClick={() => mapRef.current?.locate()}
        onManualClick={showManual}
        onSchoolCarClick={() => toggleSchoolCarDialog(true)}
        onChatClick={toChatAI}
      />

      <CategoriesDrawer
        isOpen={drawerType !== null}
        onClose={() => toggleDrawer(null)}
        title={getDrawerTitle(drawerType)}
        buildings={getDrawerBuildings(drawerType)}
        selectedCategory={getDrawerCategory(drawerType)}
        onBuildingSelect={(building, index) =>
          drawerType && handleDrawerItemSelect(drawerType, building, index)
        }
        type={drawerType || "location"}
      />

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
