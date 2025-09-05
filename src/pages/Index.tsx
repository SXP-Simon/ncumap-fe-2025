import { useRef, Suspense } from 'react';
import { Tabs, Drawer, List, Button, Modal, Progress } from 'antd';
import OpenMap, { type OpenMapRef } from '../components/OpenMap';
import './Index.css';
import { usePageLogic } from '../hooks/usePageLogic';

const Index: React.FC = () => {
  const mapRef = useRef<OpenMapRef | null>(null);
  const {
    map,
    location,
    isCategoriesSheetShow,
    setIsCategoriesSheetShow,
    isManualShow,
    setIsManualShow,
    isActivitiesSheetShow,
    setIsActivitiesSheetShow,
    schoolCarDialog,
    setSchoolCarDialog,
    schoolCarNumber,
    setSchoolCarNumber,
    bottomSheetSelected,
    manualData,
    // activitiesData (kept in hook)
    manualGroupIndex,
    manualSelectedIndex,
    showBottomSheet,
    showManual,
    bottomSheetSelect,
    manualRedirect,
    manualSelect,
    toChatAI,
    handleFeatureSelected,
    getCurrentMarks,
    getActivitiesList,
  } = usePageLogic(mapRef);

  const tabItems = map.categories.map((category, index) => ({ key: index.toString(), label: category }));

  return (
    <div className="index-container">
      {/* 上方选项卡 */}
      <div className="tabs-container">
        <Tabs activeKey={map.currentCategory.toString()} items={tabItems} onTabClick={showBottomSheet} />
      </div>
      
      {/* 主地图 */}
      <div className={`map-view ${isCategoriesSheetShow || isManualShow || isActivitiesSheetShow ? 'half' : ''}`}>
        <Suspense fallback={
          <div className="loading-container">
            <Progress type="circle" />
            <p>加载地图中</p>
          </div>
        }>
          <OpenMap ref={mapRef} x={location.x} y={location.y} onFeatureSelected={handleFeatureSelected} />
        </Suspense>
      </div>

      {/* 右侧按钮 */}
      <div className="overlay">
        <div className="actions">
          <div>
            <Button type="text" className="action-button" onClick={showManual}>
              <img src="/icons/新生手册.svg" alt="手册" />
              手册
            </Button>
          </div>
          <div>
            <Button type="text" className="action-button" onClick={() => setSchoolCarDialog(true)}>
              <img src="/icons/校车.svg" alt="校车" />
              校车
            </Button>
          </div>
          <div>
            <Button type="text" className="action-button" onClick={() => mapRef.current?.locate()}>
              <img src="/icons/定位.svg" alt="定位" />
              定位
            </Button>
          </div>
          <div>
            <Button type="text" className="action-button" onClick={toChatAI}>
              <img src="/icons/问答.svg" alt="问答" />
              问答
            </Button>
          </div>
        </div>
      </div>

      {/* 建筑选择菜单 */}
      <Drawer title="选择地点" placement="bottom" height="50vh" open={isCategoriesSheetShow} onClose={() => setIsCategoriesSheetShow(false)} className="bottom-sheet">
        <List dataSource={getCurrentMarks()} renderItem={(item: any, index: number) => (
          <List.Item className={`list-item ${index === bottomSheetSelected ? 'selected' : ''}`} onClick={() => bottomSheetSelect(index)}>
            <List.Item.Meta
              title={<div className="list-item-title"><span>{item.name}</span>{index === bottomSheetSelected && <img src="/flag.svg" alt="selected" />}</div>}
              description={item.info}
            />
          </List.Item>
        )} />
        <div className="chat-ai-link">进入<span className="chatAI" onClick={toChatAI}>漫游指北</span>了解更多</div>
        <div className="drawer-actions">
          <Button onClick={() => setIsCategoriesSheetShow(false)}>取消</Button>
          <Button type="primary" disabled={bottomSheetSelected === -1} onClick={() => {
            if (bottomSheetSelected >= 0) {
              const selectedMark = getCurrentMarks()[bottomSheetSelected];
              handleFeatureSelected(selectedMark.location_id ?? selectedMark.id ?? selectedMark.locationId);
            }
          }}>详情</Button>
        </div>
      </Drawer>

      {/* 活动列表抽屉 */}
      <Drawer title="活动" placement="bottom" height="50vh" open={isActivitiesSheetShow} onClose={() => setIsActivitiesSheetShow(false)} className="bottom-sheet">
        <List dataSource={getActivitiesList()} renderItem={(item: any) => (
          <List.Item className={`list-item`} onClick={() => {
            setIsActivitiesSheetShow(false);
            const id = item.location_id ?? (item.raw && item.raw.location_id) ?? (item.raw && item.raw.locationId);
            if (id) handleFeatureSelected(id);
          }}>
            <List.Item.Meta title={<div className="list-item-title"><span>{item.title}</span></div>} description={item.name || (item.raw && item.raw.description) || ''} />
          </List.Item>
        )} />
        <div className="drawer-actions"><Button onClick={() => setIsActivitiesSheetShow(false)}>取消</Button></div>
      </Drawer>

      {/* 新生手册抽屉 */}
      <Drawer title="手册" placement="bottom" height="50vh" open={isManualShow} onClose={() => setIsManualShow(false)} className="bottom-sheet">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ overflow: 'auto', flex: 1 }}>
            {manualData ? (
              <div>
                {Object.keys(manualData).map((groupKey, gi) => (
                  <div key={groupKey} style={{ padding: '8px 0' }}>
                    <div style={{ padding: '0 16px', color: '#476491', fontSize: 13 }}>{groupKey}</div>
                    <List dataSource={manualData[groupKey]} renderItem={(item: any, idx: number) => (
                      <List.Item className={`list-item ${manualGroupIndex === gi && manualSelectedIndex === idx ? 'selected' : ''}`} onClick={() => manualSelect(idx, gi)}>
                        <List.Item.Meta title={<span style={{ fontSize: 15, color: 'black' }}>{item.name}</span>} />
                      </List.Item>
                    )} />
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
      <Modal open={schoolCarDialog} onCancel={() => setSchoolCarDialog(false)} footer={null} width="auto" className="school-car-modal">
        <Button className="back-button" onClick={() => setSchoolCarDialog(false)}>
          <img src="/back.svg" alt="返回" />
        </Button>
        <img src={schoolCarNumber === 0 ? "/schoolCar.svg" : "/schoolCar1.svg"} alt="校车" onClick={() => setSchoolCarNumber(schoolCarNumber === 0 ? 1 : 0)} style={{ cursor: 'pointer', width: '100%' }} />
      </Modal>
    </div>
  );
};

export default Index;
