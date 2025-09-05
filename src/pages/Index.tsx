import { useRef, Suspense, Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Tab, TabGroup, TabList } from '@headlessui/react';
import { XMarkIcon, MapPinIcon, BookOpenIcon, TruckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import OpenMap, { type OpenMapRef } from '../components/OpenMap';
import { usePageLogic } from '../hooks';
import type { MapMark, ActivityListItem, ManualItem } from '../hooks/types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

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
      schoolCarNumber,
      bottomSheetSelected
    },
    data: {
      manualData,
      manualGroupIndex,
      manualSelectedIndex
    }
  } = state;

  // 解构动作，提供简化的访问方式
  const { 
    showBottomSheet, 
    showManual, 
    bottomSheetSelect,
    toggleCategoriesSheet,
    toggleManualSheet,
    toggleActivitiesSheet,
    toggleSchoolCarDialog,
    setSchoolCarNumber
  } = uiActions;
  
  const { manualRedirect, manualSelect, toChatAI, handleFeatureSelected } = navigationActions;
  const { getCurrentMarks } = mapActions;
  const { getActivitiesList } = dataActions;

    // 创建选项卡数据

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* 上方选项卡 */}
      {map.marks && (
        <div className="absolute z-50 w-full bg-white/95  shadow-lg border-b border-gray-200 px-4 py-3">
          <TabGroup selectedIndex={map.currentCategory} onChange={(index) => showBottomSheet(index.toString())}>
            <TabList className="flex space-x-2 bg-gray-100 rounded-xl p-1 max-w-full overflow-x-auto">
              {map.categories.map((category, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    classNames(
                      'whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-400 ease-in-out',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      'min-w-fit flex-shrink-0',
                      selected
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-md'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        </div>
      )}

      {/* 主地图 */}
      <div className={`h-screen w-full pt-16 transition-all duration-300 ${
        isCategoriesSheetShow || isManualShow || isActivitiesSheetShow ? 'h-1/2' : ''
      }`}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        }>
          <OpenMap ref={mapRef} x={location.x} y={location.y} onFeatureSelected={handleFeatureSelected} />
        </Suspense>
      </div>

      {/* 右侧按钮 */}
      {map.marks && (
        <div className="absolute right-4 top-20 z-50 flex flex-col space-y-3">
          <div className="flex flex-col space-y-2">
            <button className="btn action-button bg-white/90  shadow-lg border border-gray-200 rounded-lg" onClick={showManual}>
              <BookOpenIcon className="h-5 w-5" />
              <span className="text-xs font-medium">手册</span>
            </button>
            
            <button className="btn action-button bg-white/90  shadow-lg border border-gray-200 rounded-lg" onClick={() => toggleSchoolCarDialog(true)}>
              <TruckIcon className="h-5 w-5" />
              <span className="text-xs font-medium">校车</span>
            </button>
            
            <button className="btn action-button bg-white/90  shadow-lg border border-gray-200 rounded-lg" onClick={() => mapRef.current?.locate()}>
              <MapPinIcon className="h-5 w-5" />
              <span className="text-xs font-medium">定位</span>
            </button>
            
            <button className="btn action-button bg-white/90  shadow-lg border border-gray-200 rounded-lg" onClick={toChatAI}>
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span className="text-xs font-medium">问答</span>
            </button>
          </div>
        </div>
      )}

      {/* 建筑选择菜单 */}
      <Transition show={isCategoriesSheetShow} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => toggleCategoriesSheet(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-0"
            leave="ease-in duration-300"
            leaveFrom="opacity-0"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-0" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-400"
                enterFrom="opacity-0 translate-y-2 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-full scale-95"
              >
                <DialogPanel className="w-full max-h-[50vh] transform overflow-hidden rounded-t-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all backdrop-blur-lg border-t border-gray-100">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    选择地点
                  </DialogTitle>
                  
                  <div className="max-h-64 overflow-y-auto overflow-x-hidden space-y-2 pr-2">
                    {getCurrentMarks().map((item: MapMark, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-500 ease-in-out hover:shadow-md transform hover:scale-[1.005] ${
                          index === bottomSheetSelected 
                            ? 'bg-blue-50 border-blue-300 shadow-md scale-[1.005]' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        onClick={() => bottomSheetSelect(index)}
                      >
                        <div className="flex justify-between items-start overflow-hidden">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.info}</p>
                          </div>
                          {index === bottomSheetSelected && (
                            <img src="/flag.svg" alt="selected" className="w-4 h-4 ml-2 flex-shrink-0 transition-opacity duration-500 ease-in-out" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center text-sm text-gray-600 my-4">
                    进入<span className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-300 hover:underline" onClick={toChatAI}>漫游指北</span>了解更多
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                      onClick={() => toggleCategoriesSheet(false)}
                    >
                      取消
                    </button>
                    <button
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                      disabled={bottomSheetSelected === -1}
                      onClick={() => {
                        if (bottomSheetSelected >= 0) {
                          const selectedMark = getCurrentMarks()[bottomSheetSelected];
                          handleFeatureSelected(selectedMark.location_id ?? String(selectedMark.id) ?? selectedMark.locationId);
                        }
                      }}
                    >
                      详情
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 活动列表抽屉 */}
      <Transition show={isActivitiesSheetShow} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => toggleActivitiesSheet(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-0 " />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-400"
                enterFrom="opacity-0 translate-y-full scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-full scale-95"
              >
                <DialogPanel className="w-full max-h-[50vh] transform overflow-hidden rounded-t-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all backdrop-blur-lg border-t border-gray-100">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    活动
                  </DialogTitle>
                  
                  <div className="max-h-64 overflow-y-auto overflow-x-hidden space-y-2 pr-2">
                    {getActivitiesList().length > 0 ? (
                      getActivitiesList().map((item: ActivityListItem, index: number) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg border bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all duration-500 ease-in-out hover:shadow-md transform hover:scale-[1.005]"
                          onClick={() => {
                            toggleActivitiesSheet(false);
                            const rawItem = item.raw;
                            const id = item.location_id ?? 
                              ('location_id' in rawItem ? rawItem.location_id : undefined) ?? 
                              ('locationId' in rawItem ? rawItem.locationId : undefined) ??
                              ('id' in rawItem ? String(rawItem.id) : undefined);
                            if (id) handleFeatureSelected(id);
                          }}
                        >
                          <div className="overflow-hidden">
                            <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.name || ('info' in item.raw ? item.raw.info : ('description' in item.raw ? item.raw.description : ''))}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 mb-4 text-gray-300">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动</h3>
                        <p className="text-sm text-gray-500 mb-4">当前没有可用的活动信息</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => toggleActivitiesSheet(false)}
                    >
                      取消
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 新生手册抽屉 */}
      <Transition show={isManualShow} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => toggleManualSheet(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-0 " />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-400"
                enterFrom="opacity-0 translate-y-full scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-full scale-95"
              >
                <DialogPanel className="w-full max-h-[50vh] transform overflow-hidden rounded-t-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all backdrop-blur-lg border-t border-gray-100">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    手册
                  </DialogTitle>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {manualData ? (
                      <div className="space-y-4">
                        {Object.keys(manualData).map((groupKey, gi) => (
                          <div key={groupKey}>
                            <h4 className="text-sm font-medium text-blue-600 mb-2 px-4">{groupKey}</h4>
                            <div className="space-y-1">
                              {manualData[groupKey].map((item: ManualItem, idx: number) => (
                                <div
                                  key={idx}
                                  className={`p-3 mx-2 rounded-lg cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-[1.002] hover:shadow-lg ${
                                    manualGroupIndex === gi && manualSelectedIndex === idx
                                      ? 'bg-blue-50 border border-blue-300 shadow-md hover:scale-[1.002]'
                                      : 'bg-white hover:bg-blue-50 hover:border-blue-200 border border-gray-200'
                                  }`}
                                  onClick={() => manualSelect(idx, gi)}
                                >
                                  <span className="text-black font-medium">{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-600 py-8">加载中...</div>
                    )}
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => toggleManualSheet(false)}
                    >
                      取消
                    </button>
                    <button
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={manualSelectedIndex === -1}
                      onClick={manualRedirect}
                    >
                      详情
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 校车对话框 */}
      <Transition show={schoolCarDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => toggleSchoolCarDialog(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 " />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-400"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all backdrop-blur-lg border border-gray-100">
                  <div className="relative">
                    <button
                      className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
                      onClick={() => toggleSchoolCarDialog(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                    
                    <img 
                      src={schoolCarNumber === 0 ? "/schoolCar.svg" : "/schoolCar1.svg"} 
                      alt="校车" 
                      onClick={() => setSchoolCarNumber(schoolCarNumber === 0 ? 1 : 0)} 
                      className="cursor-pointer w-full rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                    />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Index;
