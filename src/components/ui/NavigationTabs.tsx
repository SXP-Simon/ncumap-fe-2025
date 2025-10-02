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
    <div className="w-full bg-white/40 backdrop-blur-xl border-b border-white/20">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 px-4 py-3 scrollbar-hide"
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
              className={`whitespace-nowrap flex-shrink-0 transition-all rounded-xl ${isSelected ? 'shadow-lg' : ''}`}
            >
              {category}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
