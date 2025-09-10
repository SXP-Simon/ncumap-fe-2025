import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Card,
  CardBody,
  Button,
  Chip
} from "@heroui/react";
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { UIListItem } from '@/types/activity';

export type DrawerType = 'location' | 'activity' | 'manual';

const getEmptyMessage = (type: DrawerType, defaultMessage: string): string => {
  switch (type) {
    case 'location':
      return '该分类下暂无地点';
    case 'activity':
      return '暂无活动数据';
    case 'manual':
      return '暂无手册数据';
    default:
      return defaultMessage;
  }
};

interface CategoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buildings: UIListItem[];
  onBuildingSelect: (building: UIListItem, index: number) => void;
  selectedCategory: string;
  emptyMessage?: string;
  type: DrawerType;
}

export const CategoriesDrawer: React.FC<CategoriesDrawerProps> = ({
  isOpen,
  onClose,
  title,
  buildings,
  onBuildingSelect,
  selectedCategory,
  emptyMessage = "该分类下暂无地点",
  type
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [internalOpen, setInternalOpen] = useState(isOpen);

  // 处理渐变关闭动画
  const handleClose = () => {
    setIsClosing(true);
    // 延迟执行真正的关闭，等待动画完成
    setTimeout(() => {
      setIsClosing(false);
      setInternalOpen(false);
      onClose();
    }, 300); // 300ms 动画时间
  };

  // 处理建筑选择并触发关闭动画
  const handleBuildingSelect = (building: UIListItem, index: number) => {
    setIsClosing(true);
    // 稍微延迟一下再执行选择，让用户看到点击反馈
    setTimeout(() => {
      onBuildingSelect(building, index);
      setIsClosing(false);
      setInternalOpen(false);
      onClose();
    }, 150); // 150ms 更快的响应时间
  };

  // 同步外部 isOpen 状态
  useEffect(() => {
    if (isOpen && !internalOpen) {
      setInternalOpen(true);
      setIsClosing(false);
    }
  }, [isOpen, internalOpen]);

  return (
    <Drawer 
      isOpen={internalOpen} 
      placement="bottom" 
      onOpenChange={(open) => !open && handleClose()}
      size="lg"
      hideCloseButton={true}
      className={`
        [&_[data-slot=backdrop]]:glass-modal-backdrop
        ${isClosing 
          ? '[&_[data-slot=backdrop]]:bg-black/0 [&_[data-slot=backdrop]]:backdrop-blur-0' 
          : ''
        }
      `}
    >
      <DrawerContent className={`
        glass-base glass-container-lg
        max-h-[75vh] min-h-[50vh]
        transition-all duration-300 ease-out
        rounded-t-2xl overflow-hidden
        ${isClosing 
          ? 'bg-white/0 backdrop-blur-0 opacity-0 translate-y-full' 
          : 'opacity-100 translate-y-0'
        }
      `}>
        {() => (
          <>
            <DrawerHeader className={`
              flex items-center justify-between px-5 py-4
              glass-header relative z-20 transition-all duration-300
              ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}
            `}>
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="glass-icon-container-lg flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-blue-500 drop-shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 drop-shadow-lg truncate">{title}</h3>
                  <Chip 
                    size="sm" 
                    variant="flat"
                    className="glass-chip text-blue-600 mt-1"
                  >
                    {selectedCategory}
                  </Chip>
                </div>
              </div>
              
              <Button
                isIconOnly
                size="md"
                variant="light"
                onPress={handleClose}
                className="glass-button"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </Button>
            </DrawerHeader>

            <DrawerBody className="
              flex-1 overflow-y-auto px-4 py-4 relative z-10 bg-white/2 backdrop-blur-xl
              max-h-[calc(75vh-10rem)]
            ">
              {buildings.length === 0 ? (
                <div className={`
                  flex flex-col items-center justify-center py-20
                  glass-base glass-container relative overflow-hidden
                  transition-all duration-300
                  ${isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                `}>
                  <div className="glass-icon-container w-24 h-24 flex-center mb-6">
                    <MapPinIcon className="w-12 h-12 text-gray-400 drop-shadow-lg" />
                  </div>
                  <p className="text-lg font-medium text-gray-600 drop-shadow-sm">
                    {getEmptyMessage(type, emptyMessage)}
                  </p>
                </div>
              ) : (
                <div className={`space-y-3 w-full transition-all duration-300 ${
                  isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  {buildings.map((building, index) => (
                    <Card
                      key={building.id || index}
                      isPressable
                      onPress={() => handleBuildingSelect(building, index)}
                      className="glass-base glass-card group w-full"
                    >
                      <CardBody className="p-5 relative z-10">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div className="glass-icon-container-sm flex-shrink-0 group-hover:scale-110 transition-all duration-300">
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
                                              {building.functions.slice(0, 4).map((func: string, idx: number) => (
                                                <Chip
                                                  key={idx}
                                                  size="sm"
                                                  variant="flat"
                                                  className="glass-chip text-blue-600 flex-shrink-0"
                                                >
                                                  {func}
                                                </Chip>
                                              ))}
                                  {building.functions.length > 4 && (
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      className="glass-chip text-gray-500 flex-shrink-0"
                                    >
                                      +{building.functions.length - 4}
                                    </Chip>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="glass-button-sm ml-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-lg"></div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
