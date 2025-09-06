import { Tabs, Tab } from "@heroui/react";

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
  return (
    <div className="w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 px-4 py-3">
      <Tabs
        aria-label="Navigation categories"
        selectedKey={selectedIndex.toString()}
        onSelectionChange={(key) => onSelectionChange(Number(key))}
        variant="solid"
        color="primary"
        className="w-full"
        classNames={{
          tabList: "gap-2 w-full relative rounded-xl bg-gray-100 p-1",
          cursor: "w-full bg-primary-600",
          tab: "max-w-fit px-4 h-10",
          tabContent: "group-data-[selected=true]:text-white"
        }}
      >
        {categories.map((category, index) => (
          <Tab
            key={index}
            title={category}
            className="min-w-fit flex-shrink-0"
          />
        ))}
      </Tabs>
    </div>
  );
};
