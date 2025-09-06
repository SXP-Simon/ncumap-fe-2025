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
import type { MapMark } from '../../hooks/types';

interface GlassmorphismSelectingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buildings: MapMark[];
  onBuildingSelect: (building: MapMark, index: number) => void;
  selectedCategory: string;
  emptyMessage?: string;
}

export const GlassmorphismSelectingSheet: React.FC<GlassmorphismSelectingSheetProps> = ({
  isOpen,
  onClose,
  title,
  buildings,
  onBuildingSelect,
  selectedCategory,
  emptyMessage = "该分类下暂无地点"
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
  const handleBuildingSelect = (building: MapMark, index: number) => {
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
      className={`
        [&_[data-slot=backdrop]]:transition-all [&_[data-slot=backdrop]]:duration-300
        ${isClosing 
          ? '[&_[data-slot=backdrop]]:bg-black/0 [&_[data-slot=backdrop]]:backdrop-blur-0' 
          : '[&_[data-slot=backdrop]]:bg-black/10 [&_[data-slot=backdrop]]:backdrop-blur-2xl'
        }
      `}
    >
      <DrawerContent className={`
        border border-white/20 rounded-t-3xl
        shadow-2xl shadow-black/20
        before:absolute before:inset-0 before:rounded-t-3xl
        before:bg-gradient-to-br before:from-white/10 before:via-white/5 before:to-transparent
        before:border before:border-white/10 before:pointer-events-none
        after:absolute after:top-0 after:left-1/4 after:right-1/4 after:h-px
        after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent
        after:blur-sm after:pointer-events-none
        max-h-[75vh] min-h-[50vh]
        transition-all duration-300 ease-out
        ${isClosing 
          ? 'bg-white/0 backdrop-blur-0 opacity-0 translate-y-full' 
          : 'bg-white/5 backdrop-blur-3xl opacity-100 translate-y-0'
        }
      `}>
        {() => (
          <>
            <div className={`
              flex justify-center pt-4 pb-2 relative z-20
              before:absolute before:inset-0 before:bg-white/5 before:backdrop-blur-lg
              transition-all duration-200
              ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}>
              <div className="
                w-12 h-1.5 bg-white/30 backdrop-blur-xl rounded-full
                shadow-inner shadow-white/20 border border-white/30
                relative overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-r
                before:from-transparent before:via-white/50 before:to-transparent before:rounded-full
              "></div>
            </div>

            <DrawerHeader className={`
              flex items-center justify-between px-5 py-4
              bg-white/3 backdrop-blur-2xl border-b border-white/10
              relative z-20 transition-all duration-300
              ${isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}
            `}>
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
                onPress={handleClose}
                className="
                  bg-white/10 backdrop-blur-xl border border-white/20
                  hover:bg-white/20 hover:scale-105
                  transition-all duration-300 rounded-xl
                  shadow-inner shadow-white/10
                "
              >
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </Button>
            </DrawerHeader>

            <DrawerBody className="
              flex-1 overflow-y-auto px-4 py-4 relative z-10
              bg-white/2 backdrop-blur-xl
              max-h-[calc(75vh-10rem)]
            ">
              {buildings.length === 0 ? (
                <div className={`
                  flex flex-col items-center justify-center py-20
                  bg-white/5 backdrop-blur-2xl border border-white/10 
                  rounded-2xl shadow-xl shadow-black/5
                  relative overflow-hidden
                  before:absolute before:inset-0 before:rounded-2xl
                  before:bg-gradient-to-br before:from-white/5 before:to-transparent
                  transition-all duration-300
                  ${isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                `}>
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
                <div className={`space-y-3 w-full transition-all duration-300 ${
                  isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  {buildings.map((building, index) => (
                    <Card
                      key={building.id || index}
                      isPressable
                      onPress={() => handleBuildingSelect(building, index)}
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
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
