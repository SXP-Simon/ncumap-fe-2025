import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NavigationTabsProps {
  categories: string[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  categories,
  selectedIndex,
  onSelectionChange
}) => {
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 检查是否需要显示滚动按钮
  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [categories]);

  // 滚动到选中的标签
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const selectedButton = container.children[selectedIndex] as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedIndex]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="w-full relative">
      {/* 高级透明玻璃背景框架 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0.5 via-white/1 to-white/0.3 backdrop-blur-3xl">
        {/* 多层玻璃反射效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0.3 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/1.5 via-transparent to-white/0.5"></div>
        
        {/* 玻璃边框和内表面 */}
        <div className="absolute inset-0 border-t border-white/2 border-b border-white/1.5 shadow-lg shadow-black/0.5"></div>
        <div className="absolute inset-0 shadow-inner shadow-white/3"></div>
        
        {/* 顶部和底部光线 */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/3 to-transparent blur-sm"></div>
        <div className="absolute bottom-0 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-white/2 to-transparent"></div>
      </div>
      
      <div className="relative flex items-center min-h-[72px] px-3">
        {/* 左侧滚动按钮 - 透明玻璃设计 (小屏幕隐藏) */}
        {showLeftScroll && (
          <div className="absolute left-4 z-30 hidden md:block">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={scrollLeft}
              className="
                bg-white/0.5 backdrop-blur-2xl border border-white/3 
                shadow-sm shadow-black/1 hover:bg-white/2 hover:border-white/6
                hover:shadow-md hover:shadow-black/2 transition-all duration-500 
                rounded-2xl transform hover:scale-105
                before:absolute before:inset-0 before:bg-gradient-to-br 
                before:from-white/1 before:to-transparent before:rounded-2xl
                after:absolute after:inset-0 after:border after:border-white/2 
                after:rounded-2xl after:shadow-inner after:shadow-white/5
              "
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-400 drop-shadow-sm" />
            </Button>
          </div>
        )}

        {/* 标签容器 - 纯透明玻璃质感 */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-6 px-4 md:px-12 gap-4 scrollbar-hide scroll-smooth"
        >
          {categories.map((category, index) => {
            const isSelected = selectedIndex === index;
            return (
              <Button
                key={category}
                variant="light"
                size="md"
                onPress={() => onSelectionChange(index)}
                className={`
                  relative min-w-fit px-10 py-4 font-medium text-sm whitespace-nowrap
                  transition-all duration-700 ease-out rounded-xl group
                  ${isSelected 
                    ? `
                      bg-gradient-to-br from-white/15 via-white/20 to-white/12 
                      backdrop-blur-xl border border-white/25 text-gray-800
                      shadow-xl shadow-black/8 hover:shadow-2xl hover:shadow-black/10
                      transform scale-103 hover:scale-105
                      before:absolute before:inset-0 before:bg-gradient-to-br 
                      before:from-white/30 before:via-white/15 before:to-transparent before:rounded-xl
                      after:absolute after:inset-px after:bg-gradient-to-br 
                      after:from-transparent after:to-white/8 after:rounded-xl
                    `
                    : `
                      bg-white/0.5 backdrop-blur-2xl border border-white/2 
                      text-gray-400 hover:bg-white/1.5 hover:border-white/4
                      shadow-sm shadow-black/0.5 hover:shadow-md hover:shadow-black/1
                      transform hover:scale-102
                      before:absolute before:inset-0 before:bg-gradient-to-br 
                      before:from-white/0.3 before:to-transparent before:rounded-xl
                      after:absolute after:inset-0 after:shadow-inner 
                      after:shadow-white/2 after:rounded-xl
                    `
                  }
                `}
              >
                {/* 纯净玻璃光效层 */}
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-white/25 rounded-xl"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/8 via-white/12 to-white/8 rounded-xl blur-lg -z-10 opacity-60"></div>
                  </>
                )}
                
                {/* 极致纯净文字 */}
                <span className={`relative z-10 ${isSelected ? 'drop-shadow-md' : 'drop-shadow-sm'}`}>
                  {category}
                </span>
                
                {/* 玻璃内表面反射 */}
                <div className={`
                  absolute inset-0 rounded-xl transition-all duration-700
                  ${isSelected 
                    ? 'shadow-inner shadow-white/10' 
                    : 'group-hover:shadow-inner group-hover:shadow-white/5'
                  }
                `}></div>
              </Button>
            );
          })}
        </div>

        {/* 右侧滚动按钮 - 透明玻璃设计 (小屏幕隐藏) */}
        {showRightScroll && (
          <div className="absolute right-4 z-30 hidden md:block">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={scrollRight}
              className="
                bg-white/0.5 backdrop-blur-2xl border border-white/3 
                shadow-sm shadow-black/1 hover:bg-white/2 hover:border-white/6
                hover:shadow-md hover:shadow-black/2 transition-all duration-500 
                rounded-2xl transform hover:scale-105
                before:absolute before:inset-0 before:bg-gradient-to-br 
                before:from-white/1 before:to-transparent before:rounded-2xl
                after:absolute after:inset-0 after:border after:border-white/2 
                after:rounded-2xl after:shadow-inner after:shadow-white/5
              "
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-400 drop-shadow-sm" />
            </Button>
          </div>
        )}
      </div>
      
      {/* 透明玻璃底部框架 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/0.8 to-transparent shadow-sm shadow-white/2"></div>
      <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-gray-50/0.5 to-transparent"></div>
      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-white/1 to-transparent blur-sm"></div>
    </div>
  );
};
