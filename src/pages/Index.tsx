import { useRef, Suspense } from 'react';
import { Spinner } from '@heroui/react';
import OpenMap, { type OpenMapRef } from '../components/OpenMap';
import { usePageLogic } from '../hooks';
import { NavigationTabs, SchoolCarModal, BottomSheet, FloatingActionButtons } from '../components/ui';
import type { MapMark, ActivityListItem, ManualItem } from '../hooks/types';

const Index: React.FC = () => {
  const mapRef = useRef<OpenMapRef | null>(null);
  const {
    mapActions,
    uiActions,
    navigationActions,
    dataActions,
    state
  } = usePageLogic(mapRef);

  // 解构状态，保持向后兼容
  const {
    map,
    location,
    ui: {
      isCategoriesSheetShow,
      isManualShow,
      isActivitiesSheetShow,
      schoolCarDialog,
      schoolCarNumber
    },
    data: {
      manualData
    }
  } = state;

  // 解构动作，提供简化的访问方式
  const { 
    showBottomSheet, 
    showManual, 
    toggleCategoriesSheet,
    toggleManualSheet,
    toggleActivitiesSheet,
    toggleSchoolCarDialog,
    setSchoolCarNumber
  } = uiActions;
  
  const { manualSelectOnly, toChatAI, handleFeatureSelected } = navigationActions;
  const { getCurrentMarks } = mapActions;
  const { getActivitiesList } = dataActions;

    // 创建选项卡数据

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* 上方选项卡 */}
      {map.marks && (
        <div className="absolute z-50 w-full">
          <NavigationTabs
            categories={map.categories}
            selectedIndex={map.currentCategory}
            onSelectionChange={(index) => showBottomSheet(index.toString())}
          />
        </div>
      )}

      {/* 主地图 */}
      <div className={`h-screen w-full pt-16 transition-all duration-300 ${
        isCategoriesSheetShow || isManualShow || isActivitiesSheetShow ? 'h-1/2' : ''
      }`}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" color="primary" />
          </div>
        }>
          <OpenMap ref={mapRef} x={location.x} y={location.y} onFeatureSelected={handleFeatureSelected} />
        </Suspense>
      </div>

      {/* 右侧悬浮按钮 */}
      {map.marks && (
        <FloatingActionButtons
          onLocationClick={() => mapRef.current?.locate()}
          onManualClick={showManual}
          onSchoolCarClick={() => toggleSchoolCarDialog(true)}
          onChatClick={toChatAI}
        />
      )}

      {/* 建筑选择菜单 */}
      {isCategoriesSheetShow && (
        <BottomSheet
          isOpen={isCategoriesSheetShow}
          onClose={() => toggleCategoriesSheet(false)}
          title="选择地点"
          items={getCurrentMarks().map((item: MapMark, index: number) => ({
            id: item.location_id ?? String(item.id) ?? item.locationId ?? index.toString(),
            name: item.name,
            description: item.info,
            category: undefined
          }))}
          onItemClick={(item) => {
            const selectedIndex = getCurrentMarks().findIndex(mark => 
              (mark.location_id ?? String(mark.id) ?? mark.locationId) === item.id
            );
            if (selectedIndex >= 0) {
              handleFeatureSelected(item.id);
            }
          }}
          emptyMessage="该分类下暂无地点"
        />
      )}

      {/* 活动列表抽屉 */}
      {isActivitiesSheetShow && (
        <BottomSheet
          isOpen={isActivitiesSheetShow}
          onClose={() => toggleActivitiesSheet(false)}
          title="活动"
          items={getActivitiesList().length > 0 ? getActivitiesList().map((item: ActivityListItem, index: number) => ({
            id: item.location_id ?? 
                ('location_id' in item.raw ? item.raw.location_id : undefined) ?? 
                ('locationId' in item.raw ? item.raw.locationId : undefined) ??
                ('id' in item.raw ? String(item.raw.id) : undefined) ??
                index.toString(),
            name: item.title,
            description: item.name || ('info' in item.raw ? item.raw.info : ('description' in item.raw ? item.raw.description : '')),
            category: "活动"
          })) : []}
          onItemClick={(item) => {
            toggleActivitiesSheet(false);
            handleFeatureSelected(item.id);
          }}
          emptyMessage="暂无活动数据"
        />
      )}

      {/* 新生手册抽屉 */}
      {isManualShow && manualData && (
        <BottomSheet
          isOpen={isManualShow}
          onClose={() => toggleManualSheet(false)}
          title="手册"
          items={Object.keys(manualData).flatMap((groupKey, gi) =>
            manualData[groupKey].map((item: ManualItem, idx: number) => ({
              id: `${gi}-${idx}`,
              name: item.name || "未命名",
              description: undefined,
              category: groupKey
            }))
          )}
          onItemClick={(item) => {
            const [gi, idx] = item.id.split('-').map(Number);
            manualSelectOnly(idx, gi);
          }}
          emptyMessage="暂无手册数据"
        />
      )}

      {/* 校车对话框 */}
      <SchoolCarModal
        isOpen={schoolCarDialog}
        onClose={() => toggleSchoolCarDialog(false)}
        schoolCarNumber={schoolCarNumber.toString()}
        onSchoolCarNumberChange={(value: string) => setSchoolCarNumber(Number(value) || 0)}
        onConfirm={() => toggleSchoolCarDialog(false)}
      />
    </div>
  );
};

export default Index;
