import { useState, useRef, useEffect, Suspense } from 'react';
import { Tabs, Drawer, List, Button, Modal, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';
import OpenMap, { type OpenMapRef } from '../components/OpenMap';
import { mincu } from 'mincu-vanilla';
import axios from 'axios';
import './Index.css';

interface MapData {
  currentCategory: number;
  categories: string[];
  marks: any;
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<OpenMapRef>(null);
  
  const [map, setMap] = useState<MapData>({
    currentCategory: 0,
    categories: ['全部', '活动'],
    marks: null
  });
  
  const [location] = useState({ x: 115.804362, y: 28.663298 });
  const [isCategoriesSheetShow, setIsCategoriesSheetShow] = useState(false);
  const [isManualShow, setIsManualShow] = useState(false);
  const [isActivitiesSheetShow, setIsActivitiesSheetShow] = useState(false);
  const [schoolCarDialog, setSchoolCarDialog] = useState(false);
  const [schoolCarNumber, setSchoolCarNumber] = useState(0);
  const [bottomSheetSelected, setBottomSheetSelected] = useState(-1);
  const [manualData, setManualData] = useState<any>(null);
  const [activitiesData, setActivitiesData] = useState<any>(null);
  const [manualGroupIndex, setManualGroupIndex] = useState<number>(-1);
  const [manualSelectedIndex, setManualSelectedIndex] = useState<number>(-1);

  const fetcher = axios.create();
  mincu.useAxiosInterceptors(fetcher);
  const baseURL = 'https://ncumap-be.ncuos.com';

  useEffect(() => {
    const initializeData = async () => {
      try {
        // 隐藏头部
        // uiModule.handleShowHeader(false);
        
        // 获取新生手册数据
        const manualResponse = await fetcher.get(baseURL + "/api/v1/freshmen/manual");
        setManualData(manualResponse.data);
        
        // 获取活动数据
        const activitiesResponse = await fetcher.get(baseURL + "/api/v1/activity/all");
        setActivitiesData(activitiesResponse.data);
        
        // 更新地图数据
        if (mapRef.current) {
          setMap(prev => ({
            ...prev,
            categories: mapRef.current!.categories,
            marks: mapRef.current!.marks
          }));
        }
      } catch (err) {
        console.error('初始化数据失败:', err);
      }
    };

    initializeData();
  }, []);

  const showBottomSheet = (currentCategory: string) => {
    const categoryIndex = parseInt(currentCategory);
    setSchoolCarDialog(false);
    setBottomSheetSelected(-1);
    setIsManualShow(false);
    
    if (categoryIndex === 0 || categoryIndex === 1) {
      setIsCategoriesSheetShow(false);
      setIsActivitiesSheetShow(false);
      if (categoryIndex === 1) {
        setIsActivitiesSheetShow(true);
      }
    } else {
      setIsCategoriesSheetShow(true);
      setIsActivitiesSheetShow(false);
    }
    
    setMap(prev => ({ ...prev, currentCategory: categoryIndex }));
  };

  const showManual = () => {
    setBottomSheetSelected(-1);
    if (mapRef.current) {
      mapRef.current.showAllMarks();
    }
    setIsCategoriesSheetShow(false);
    setIsManualShow(true);
  };

  const bottomSheetSelect = (index: number) => {
    setBottomSheetSelected(index);
    if (mapRef.current && map.marks) {
      const selectedMark = map.marks[map.categories[map.currentCategory]][index];
      mapRef.current.viewTo(selectedMark.coordinates);
      const markZoom = selectedMark.priority;
      mapRef.current.zoomTo(3 > markZoom ? 3 : markZoom);
    }
  };

  const manualRedirect = () => {
    if (manualData && manualGroupIndex >= 0 && manualSelectedIndex >= 0) {
      const categoryKeys = Object.keys(manualData);
      const key = categoryKeys[manualGroupIndex];
      const current = manualData[key] && manualData[key][manualSelectedIndex];
      if (current && (current.location_id || current.locationId || current.id)) {
        navigate(`/${current.location_id ?? current.locationId ?? current.id}`);
      }
    }
  };

  const manualSelect = (itemIndex: number, groupIndex: number) => {
    setManualSelectedIndex(itemIndex);
    setManualGroupIndex(groupIndex);
    const keys = Object.keys(manualData || {});
    const key = keys[groupIndex];
    const current = manualData && manualData[key] && manualData[key][itemIndex];
    if (mapRef.current && current) {
      if (current.coordinates) mapRef.current.viewTo(current.coordinates);
      const markZoom = current.priority ?? 3;
      mapRef.current.zoomTo(3 > markZoom ? 3 : markZoom);
    }
  };

  const toChatAI = () => {
    const url = "https://aiguide.ncuos.com/welcome";
    try {
      if (mincu && typeof (mincu as any).openUrl === 'function') {
        (mincu as any).openUrl(url);
        return;
      }
    } catch (e) {
      // ignore and fallback to window.open
    }
    // Fallback for web: open in new tab
    if (typeof window !== 'undefined' && window.open) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFeatureSelected = (locationId: string) => {
    navigate(`/${locationId}`);
  };

  const tabItems = map.categories.map((category, index) => ({
    key: index.toString(),
    label: category,
  }));

  const getCurrentMarks = () => {
    if (!map.marks || !map.categories[map.currentCategory]) return [];
    return map.marks[map.categories[map.currentCategory]] || [];
  };

  const getActivitiesList = () => {
    // 尝试使用后端返回的 activitiesData（可能是数组或对象），否则从 map.marks 中构建
    const list: any[] = [];

    if (activitiesData) {
      // 如果是数组，每项可能包含 location_id 或 locationId 或 target
      if (Array.isArray(activitiesData)) {
        activitiesData.forEach((it: any) => {
          list.push({
            title: it.title || it.name || it.description || it.content || String(it),
            location_id: it.location_id ?? it.locationId ?? it.location ?? null,
            raw: it
          });
        });
        return list;
      }

      // 如果是一个对象并且包含 activities 字段
      if (activitiesData.activities && Array.isArray(activitiesData.activities)) {
        activitiesData.activities.forEach((it: any) => {
          list.push({ title: it.title || it, location_id: it.location_id ?? null, raw: it });
        });
        return list;
      }
    }

    // 回退：从地图数据中提取每个地点的 activities 字段
    if (map.marks) {
      try {
        const keys = Object.keys(map.marks);
        keys.forEach((k) => {
          const arr = map.marks[k] || [];
          arr.forEach((mark: any) => {
            if (mark.activities && Array.isArray(mark.activities) && mark.activities.length > 0) {
              mark.activities.forEach((act: any) => {
                list.push({ title: act, location_id: mark.location_id ?? mark.id ?? null, name: mark.name, raw: mark });
              });
            }
          });
        });
      } catch (e) {
        // ignore
      }
    }

    return list;
  };

  return (
    <div className="index-container">
      {/* 上方选项卡 */}
      <div className="tabs-container">
        <Tabs
          activeKey={map.currentCategory.toString()}
          items={tabItems}
          onTabClick={showBottomSheet}
        />
      </div>
      
      {/* 主地图 */}
      <div className={`map-view ${isCategoriesSheetShow || isManualShow || isActivitiesSheetShow ? 'half' : ''}`}>
        <Suspense fallback={
          <div className="loading-container">
            <Progress type="circle" />
            <p>加载地图中</p>
          </div>
        }>
          <OpenMap 
            ref={mapRef}
            x={location.x} 
            y={location.y} 
            onFeatureSelected={handleFeatureSelected}
          />
        </Suspense>
      </div>

      {/* 右侧按钮 */}
      <div className="overlay">
        <div className="actions">
          <div>
            <Button 
              type="text" 
              className="action-button"
              onClick={showManual}
            >
              <img src="/icons/新生手册.svg" alt="手册" />
              手册
            </Button>
          </div>
          <div>
            <Button 
              type="text" 
              className="action-button"
              onClick={() => setSchoolCarDialog(true)}
            >
              <img src="/icons/校车.svg" alt="校车" />
              校车
            </Button>
          </div>
          <div>
            <Button 
              type="text" 
              className="action-button"
              onClick={() => mapRef.current?.locate()}
            >
              <img src="/icons/定位.svg" alt="定位" />
              定位
            </Button>
          </div>
          <div>
            <Button 
              type="text" 
              className="action-button"
              onClick={toChatAI}
            >
              <img src="/icons/问答.svg" alt="问答" />
              问答
            </Button>
          </div>
        </div>
      </div>

      {/* 建筑选择菜单 */}
      <Drawer
        title="选择地点"
        placement="bottom"
        height="50vh"
        open={isCategoriesSheetShow}
        onClose={() => setIsCategoriesSheetShow(false)}
        className="bottom-sheet"
      >
        <List
          dataSource={getCurrentMarks()}
          renderItem={(item: any, index: number) => (
            <List.Item
              className={`list-item ${index === bottomSheetSelected ? 'selected' : ''}`}
              onClick={() => bottomSheetSelect(index)}
            >
              <List.Item.Meta
                title={
                  <div className="list-item-title">
                    <span>{item.name}</span>
                    {index === bottomSheetSelected && <img src="/flag.svg" alt="selected" />}
                  </div>
                }
                description={item.info}
              />
            </List.Item>
          )}
        />
        <div className="chat-ai-link">
          进入<span className="chatAI" onClick={toChatAI}>漫游指北</span>了解更多
        </div>
        <div className="drawer-actions">
          <Button onClick={() => setIsCategoriesSheetShow(false)}>取消</Button>
          <Button 
            type="primary" 
            disabled={bottomSheetSelected === -1}
            onClick={() => {
              if (bottomSheetSelected >= 0) {
                const selectedMark = getCurrentMarks()[bottomSheetSelected];
                navigate(`/${selectedMark.location_id}`);
              }
            }}
          >
            详情
          </Button>
        </div>
      </Drawer>

      {/* 活动列表抽屉 */}
      <Drawer
        title="活动"
        placement="bottom"
        height="50vh"
        open={isActivitiesSheetShow}
        onClose={() => setIsActivitiesSheetShow(false)}
        className="bottom-sheet"
      >
        <List
          dataSource={getActivitiesList()}
          renderItem={(item: any) => (
            <List.Item
              className={`list-item`}
              onClick={() => {
                setIsActivitiesSheetShow(false);
                // 优先使用 location_id 跳转
                if (item.location_id) {
                  navigate(`/${item.location_id}`);
                } else if (item.raw && item.raw.location_id) {
                  navigate(`/${item.raw.location_id}`);
                } else {
                  // 如果没有 location 信息，则不跳转，仅显示内容
                }
              }}
            >
              <List.Item.Meta
                title={<div className="list-item-title"><span>{item.title}</span></div>}
                description={item.name || (item.raw && item.raw.description) || ''}
              />
            </List.Item>
          )}
        />
        <div className="drawer-actions">
          <Button onClick={() => setIsActivitiesSheetShow(false)}>取消</Button>
        </div>
      </Drawer>

      {/* 新生手册抽屉 */}
      <Drawer
        title="手册"
        placement="bottom"
        height="50vh"
        open={isManualShow}
        onClose={() => setIsManualShow(false)}
        className="bottom-sheet"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ overflow: 'auto', flex: 1 }}>
            {manualData ? (
              <div>
                {Object.keys(manualData).map((groupKey, gi) => (
                  <div key={groupKey} style={{ padding: '8px 0' }}>
                    <div style={{ padding: '0 16px', color: '#476491', fontSize: 13 }}>{groupKey}</div>
                    <List
                      dataSource={manualData[groupKey]}
                      renderItem={(item: any, idx: number) => (
                        <List.Item
                          className={`list-item ${manualGroupIndex === gi && manualSelectedIndex === idx ? 'selected' : ''}`}
                          onClick={() => manualSelect(idx, gi)}
                        >
                          <List.Item.Meta
                            title={<span style={{ fontSize: 15, color: 'black' }}>{item.name}</span>}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 16 }}>加载中</div>
            )}
          </div>

          <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-around' }}>
            <Button onClick={() => setIsManualShow(false)}>取消</Button>
            <Button type="primary" disabled={manualSelectedIndex === -1} onClick={manualRedirect}>详情</Button>
          </div>
        </div>
      </Drawer>

      {/* 校车对话框 */}
      <Modal
        open={schoolCarDialog}
        onCancel={() => setSchoolCarDialog(false)}
        footer={null}
        width="auto"
        className="school-car-modal"
      >
        <Button 
          className="back-button"
          onClick={() => setSchoolCarDialog(false)}
        >
          <img src="/back.svg" alt="返回" />
        </Button>
        <img 
          src={schoolCarNumber === 0 ? "/schoolCar.svg" : "/schoolCar1.svg"}
          alt="校车"
          onClick={() => setSchoolCarNumber(schoolCarNumber === 0 ? 1 : 0)}
          style={{ cursor: 'pointer', width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default Index;
