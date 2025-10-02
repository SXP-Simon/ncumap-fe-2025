import { useRef, useEffect } from 'react';
import { Button } from '@heroui/react';

interface NavigationTabsProps {
  categories: string[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  categories,
  selectedIndex,
  onSelectionChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到选中的标签
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && selectedIndex >= 0) {
      const selectedButton = container.children[selectedIndex] as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="w-full bg-gradient-to-r from-blue-50/80 via-white to-purple-50/80 backdrop-blur-sm shadow-sm">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 px-4 py-3 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((category, index) => {
          const isSelected = selectedIndex === index;
          return (
            <Button
              key={category}
              variant={isSelected ? 'solid' : 'flat'}
              color={isSelected ? 'primary' : 'default'}
              size="sm"
              onPress={() => onSelectionChange(index)}
              className={`
                whitespace-nowrap snap-start flex-shrink-0 transition-all duration-200 rounded-xl
                ${isSelected ? 'shadow-md scale-105' : 'hover:scale-102'}
              `}
            >
              {category}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
