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
    <div className="w-full relative bg-white border-b">
      {showLeftScroll && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
          <Button isIconOnly size="sm" variant="light" onPress={scrollLeft}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 px-4 py-2 touch-pan-x"
      >
        {categories.map((category, index) => {
          const isSelected = selectedIndex === index;
          return (
            <Button
              key={category}
              variant={isSelected ? "solid" : "light"}
              color={isSelected ? "primary" : "default"}
              size="sm"
              onPress={() => onSelectionChange(index)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          );
        })}
      </div>

      {showRightScroll && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          <Button isIconOnly size="sm" variant="light" onPress={scrollRight}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
