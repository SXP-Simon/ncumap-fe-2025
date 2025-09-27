import { useEffect, useMemo, useRef, useState } from 'react';
import OpenMap, { type OpenMapRef } from '@/components/OpenMap';
import {
  NavigationTabs,
  SchoolCarModal,
  CategoriesDrawer,
  FloatingActionButtons,
} from '@/components/ui';
import { getFreshmenManual } from '@/services/manual';
import { getAllActivities } from '@/services/activity';
import { getCampusMarks } from '@/services/campus';
import { toChatAI } from '@/utils/navigation';

import type { MapMark, MapMarks } from '@/types/map';
import type { ManualData, ManualListItem } from '@/types/manual';
import type { ActivityItem } from '@/types/activity';
import type { DrawerItem, DrawerType } from '@/components/ui/CategoriesDrawer';

const Index: React.FC = () => {
  const mapRef = useRef<OpenMapRef | null>(null);

  const [marks, setMarks] = useState<MapMarks>({});
  const [categories, setCategories] = useState<string[]>(['全部', '活动']);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [location] = useState({ x: 115.804362, y: 28.663298 });
  const [drawerType, setDrawerType] = useState<DrawerType | null>(null);
  const [schoolCarDialog, setSchoolCarDialog] = useState(false);
  const [schoolCarNumber, setSchoolCarNumber] = useState(0);
  const [manualList, setManualList] = useState<ManualListItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manualResponse, activitiesResponse, marksResponse] = await Promise.all([
          getFreshmenManual(),
          getAllActivities(),
          getCampusMarks(),
        ]);
        const manualData: ManualData | undefined = manualResponse.data;
        const campusMarks = marksResponse.data;
        if (campusMarks) {
          const newCategories = ['全部', '活动', ...Object.keys(campusMarks)];
          setMarks(campusMarks);
          setCategories(newCategories);
        }
        if (manualData) {
          setManualList(flattenManualData(manualData));
        }
        if (Array.isArray(activitiesResponse.data)) {
          setActivities(activitiesResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const flattenManualData = (data: ManualData): ManualListItem[] => {
    return Object.entries(data).flatMap(([category, items]) =>
      items.map((item) => ({
        ...item,
        category,
      }))
    );
  };

  const getDrawerTitle = (type: DrawerType | null): string => {
    switch (type) {
      case 'location':
        return '选择地点';
      case 'activity':
        return '校园活动';
      case 'manual':
        return '新生手册';
      default:
        return '';
    }
  };

  const drawerItems: Record<DrawerType, DrawerItem[]> = useMemo(() => {
    const currentCategoryLabel = categories[currentCategory] || '全部';
    const currentMarks: MapMark[] =
      !marks || Object.keys(marks).length === 0
        ? []
        : currentCategory === 0
          ? Object.values(marks).flat()
          : marks[currentCategoryLabel] || [];

    const locationItems: DrawerItem[] = currentMarks.map((mark) => ({
      id: mark.location_id,
      name: mark.name,
      description: mark.info,
      locationId: mark.location_id,
      categoryLabel: currentCategory === 0 ? undefined : currentCategoryLabel,
      coordinates: mark.coordinates,
      priority: mark.priority,
    }));

    const activityItems: DrawerItem[] = activities.map((activity) => ({
      id: String(activity.id),
      name: activity.name,
      description: activity.content,
      locationId: activity.location_id,
    }));

    const manualItems: DrawerItem[] = manualList.map((item) => ({
      id: item.location_id,
      name: item.name,
      description: item.type,
      locationId: item.location_id,
      categoryLabel: item.category,
      coordinates: item.coordinates,
      priority: item.priority,
    }));

    return {
      location: locationItems,
      activity: activityItems,
      manual: manualItems,
    };
  }, [activities, manualList, marks, currentCategory, categories]);

  const getDrawerCategory = (type: DrawerType | null): string => {
    switch (type) {
      case 'location':
        return categories[currentCategory] || '全部';
      case 'activity':
        return '校园活动';
      case 'manual':
        return '新生手册';
      default:
        return '';
    }
  };

  const toggleDrawer = (type: DrawerType | null) => {
    setDrawerType(type);
  };

  const showBottomSheet = (index: string) => {
    const categoryIndex = Number(index);
    setCurrentCategory(categoryIndex);
    toggleDrawer(categoryIndex === 1 ? 'activity' : 'location');
  };

  const showManual = () => toggleDrawer('manual');
  const toggleSchoolCarDialog = (show: boolean) => setSchoolCarDialog(show);

  const mapViewToLocation = (item: DrawerItem) => {
    if (!item.locationId || !item.coordinates) return;

    if (mapRef.current) {
      mapRef.current.viewTo(item.coordinates);
      if (item.priority) {
        mapRef.current.zoomTo(Math.max(item.priority, 1));
      }
    }
  };

  const handleFeatureSelected = (locationId: string) => {
    window.location.href = `/${locationId}`;
  };

  const handleDrawerItemSelect = (type: DrawerType, item: DrawerItem) => {
    switch (type) {
      case 'location':
        mapViewToLocation(item);
        toggleDrawer(null);
        break;
      case 'activity':
        if (item.id) {
          window.location.href = `/activities/${item.id}`;
        }
        toggleDrawer(null);
        break;
      case 'manual':
        if (item.locationId) {
          mapViewToLocation(item);
        }
        toggleDrawer(null);
        break;
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <div className="absolute z-50 w-full">
        <NavigationTabs
          categories={categories}
          selectedIndex={currentCategory}
          onSelectionChange={(index) => showBottomSheet(index.toString())}
        />
      </div>

      <div
        className={`h-screen w-full transition-all duration-300 ${
          drawerType !== null ? 'h-1/2' : ''
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
        items={drawerType ? drawerItems[drawerType] : []}
        selectedCategory={getDrawerCategory(drawerType)}
        onSelect={(item) => drawerType && handleDrawerItemSelect(drawerType, item)}
        type={drawerType || 'location'}
      />

      <SchoolCarModal
        isOpen={schoolCarDialog}
        onClose={() => toggleSchoolCarDialog(false)}
        schoolCarNumber={schoolCarNumber.toString()}
        onSchoolCarNumberChange={(value: string) => setSchoolCarNumber(Number(value) || 0)}
      />
    </div>
  );
};

export default Index;
