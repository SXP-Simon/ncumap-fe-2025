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
      {/* 液体玻璃导航容器 */}
      <div className="glass-base glass-container py-3 relative overflow-hidden">
        {/* 玻璃光效层 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-white/3"></div>
        
        {/* 左侧滚动按钮 */}
        {showLeftScroll && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={scrollLeft}
              className="glass-button-sm"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        )}

        {/* 标签滚动容器 */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 scrollbar-hide scroll-smooth px-2 sm:px-8 touch-pan-x"
        >
          {categories.map((category, index) => {
            const isSelected = selectedIndex === index;
            return (
              <Button
                key={category}
                variant="light"
                size="sm"
                onPress={() => onSelectionChange(index)}
                className={`
                  relative min-w-fit px-4 py-2 font-medium text-sm whitespace-nowrap group
                  ${isSelected 
                    ? 'glass-nav-tab glass-nav-tab-active text-gray-800' 
                    : 'glass-nav-tab text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {/* 选中状态的额外光效 */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-xl pointer-events-none"></div>
                )}
                
                {/* 文字内容 */}
                <span className="relative z-10">
                  {category}
                </span>
              </Button>
            );
          })}
        </div>

        {/* 右侧滚动按钮 */}
        {showRightScroll && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={scrollRight}
              className="glass-button-sm"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
