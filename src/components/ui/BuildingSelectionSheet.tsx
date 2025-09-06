import { Card, CardBody, Button, Chip } from "@heroui/react";
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { MapMark } from '../../hooks/types';

interface BuildingSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buildings: MapMark[];
  onBuildingSelect: (building: MapMark, index: number) => void;
  selectedCategory: string;
  emptyMessage?: string;
}

export const BuildingSelectionSheet: React.FC<BuildingSelectionSheetProps> = ({
  isOpen,
  onClose,
  title,
  buildings,
  onBuildingSelect,
  selectedCategory,
  emptyMessage = "该分类下暂无地点"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 深度模糊背景遮罩 - 增强玻璃效果 */}
      <div 
        className="
          absolute inset-0 bg-black/10 backdrop-blur-2xl 
          transition-all duration-500 ease-out
        "
        onClick={onClose}
      />
      
      {/* 主容器 - 真正的玻璃拟物化 */}
      <div className="
        relative w-full h-auto max-h-[75vh] min-h-[50vh]
        bg-white/5 backdrop-blur-3xl 
        border border-white/20 rounded-t-3xl 
        shadow-2xl shadow-black/20
        transform transition-all duration-700 ease-out
        before:absolute before:inset-0 before:rounded-t-3xl
        before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent
        before:border before:border-white/10
        after:absolute after:top-0 after:left-1/4 after:right-1/4 after:h-px
        after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent
        after:blur-sm
        flex flex-col overflow-hidden
      ">
        
        {/* 顶部拖拽指示器 - 水晶质感 */}
        <div className="relative flex justify-center pt-5 pb-3 z-10">
          <div className="
            w-12 h-1.5 bg-white/20 rounded-full
            shadow-inner shadow-white/30
            border border-white/30
            relative overflow-hidden
            before:absolute before:inset-0 before:rounded-full
            before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent
          "></div>
        </div>
        
        {/* 标题栏 - 透明玻璃质感 */}
        <div className="
          relative z-10 flex items-center justify-between px-5 py-4 
          bg-white/5 backdrop-blur-xl border-b border-white/10
        ">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="
              p-3 bg-white/10 backdrop-blur-xl 
              border border-white/20 rounded-xl
              shadow-inner shadow-white/20
              relative overflow-hidden flex-shrink-0
              before:absolute before:top-0 before:left-0 before:right-0 before:h-px
              before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent
            ">
              <MapPinIcon className="w-5 h-5 text-blue-500 drop-shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 drop-shadow-lg truncate">{title}</h3>
              <Chip 
                size="sm" 
                variant="flat"
                className="
                  bg-white/10 backdrop-blur-xl text-blue-600 
                  border border-white/20 font-medium mt-1
                  shadow-inner shadow-white/10
                "
              >
                {selectedCategory}
              </Chip>
            </div>
          </div>
          
          <Button
            isIconOnly
            size="md"
            variant="light"
            onPress={onClose}
            className="
              bg-white/10 backdrop-blur-xl border border-white/20
              hover:bg-white/20 hover:scale-105
              transition-all duration-300 rounded-xl
              shadow-inner shadow-white/10
            "
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        {/* 内容区域 - 深度透明玻璃 */}
        <div className="
          flex-1 overflow-y-auto px-4 py-4 relative z-10
          bg-white/2 backdrop-blur-xl
          max-h-[calc(75vh-10rem)]
        ">
          {buildings.length === 0 ? (
            <div className="
              flex flex-col items-center justify-center py-20
              bg-white/5 backdrop-blur-2xl border border-white/10 
              rounded-2xl shadow-xl shadow-black/5
              relative overflow-hidden
              before:absolute before:inset-0 before:rounded-2xl
              before:bg-gradient-to-br before:from-white/5 before:to-transparent
            ">
              <div className="
                w-24 h-24 bg-white/10 backdrop-blur-xl 
                border border-white/20 rounded-full 
                flex items-center justify-center mb-6
                shadow-inner shadow-white/20
                relative overflow-hidden
                before:absolute before:top-2 before:left-1/4 before:right-1/4 before:h-px
                before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent
              ">
                <MapPinIcon className="w-12 h-12 text-gray-400 drop-shadow-lg" />
              </div>
              <p className="text-lg font-medium text-gray-600 drop-shadow-sm">{emptyMessage}</p>
            </div>
          ) : (
            <div className="space-y-3 w-full">
              {buildings.map((building, index) => (
                <Card
                  key={building.id || index}
                  isPressable
                  onPress={() => onBuildingSelect(building, index)}
                  className="
                    group bg-white/5 backdrop-blur-3xl 
                    border border-white/15 rounded-xl
                    hover:bg-white/10 hover:border-white/25
                    hover:scale-[1.02] hover:-translate-y-1
                    transition-all duration-400 ease-out
                    shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10
                    relative overflow-hidden w-full
                    before:absolute before:inset-0 before:rounded-xl
                    before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent
                    before:opacity-0 before:group-hover:opacity-100
                    before:transition-opacity before:duration-400
                    after:absolute after:top-0 after:left-1/4 after:right-1/4 after:h-px
                    after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
                    after:opacity-0 after:group-hover:opacity-100
                    after:transition-opacity after:duration-400
                  "
                >
                  <CardBody className="p-5 relative z-10">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="
                          p-2 bg-white/10 backdrop-blur-xl 
                          border border-white/20 rounded-lg
                          shadow-inner shadow-white/10
                          group-hover:bg-white/15 group-hover:scale-110
                          transition-all duration-300 flex-shrink-0
                        ">
                          <MapPinIcon className="w-4 h-4 text-blue-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-2">
                          <h4 className="
                            text-lg font-bold text-gray-800 
                            group-hover:text-gray-900 drop-shadow-sm
                            transition-colors duration-300 truncate
                          ">
                            {building.name}
                          </h4>
                          
                          {building.info && (
                            <p className="
                              text-sm text-gray-600 leading-relaxed
                              group-hover:text-gray-700 transition-colors duration-300
                              line-clamp-2
                            ">
                              {building.info}
                            </p>
                          )}
                          
                          {building.functions && building.functions.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {building.functions.slice(0, 4).map((func, idx) => (
                                <Chip
                                  key={idx}
                                  size="sm"
                                  variant="flat"
                                  className="
                                    bg-white/10 backdrop-blur-xl text-blue-600
                                    border border-white/20 font-medium
                                    shadow-inner shadow-white/10 flex-shrink-0
                                  "
                                >
                                  {func}
                                </Chip>
                              ))}
                              {building.functions.length > 4 && (
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  className="
                                    bg-white/10 backdrop-blur-xl text-gray-500
                                    border border-white/20 flex-shrink-0
                                  "
                                >
                                  +{building.functions.length - 4}
                                </Chip>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="
                        ml-4 p-3 bg-white/10 backdrop-blur-xl 
                        border border-white/20 rounded-xl
                        group-hover:bg-white/15 group-hover:scale-110 group-hover:rotate-3
                        transition-all duration-300 shadow-inner shadow-white/10
                        flex-shrink-0
                      ">
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-lg"></div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* 底部装饰性光线 */}
        <div className="
          absolute bottom-0 left-1/3 right-1/3 h-px
          bg-gradient-to-r from-transparent via-white/20 to-transparent
          blur-sm
        "></div>
        
        {/* 侧边反射线 */}
        <div className="
          absolute left-0 top-1/4 bottom-1/4 w-px
          bg-gradient-to-b from-transparent via-white/15 to-transparent
        "></div>
        <div className="
          absolute right-0 top-1/4 bottom-1/4 w-px
          bg-gradient-to-b from-transparent via-white/15 to-transparent
        "></div>
      </div>
    </div>
  );
};
