import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Card,
  CardBody,
  Button,
  Chip,
} from "@heroui/react";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";

export type DrawerType = "location" | "activity" | "manual";

export interface DrawerItem {
  id: string;
  name: string;
  description?: string;
  locationId?: string;
  functions?: string[];
  categoryLabel?: string;
  coordinates?: [number, number];
  priority?: number;
}

const getEmptyMessage = (type: DrawerType, defaultMessage: string): string => {
  switch (type) {
    case "location":
      return "该分类下暂无地点";
    case "activity":
      return "暂无活动数据";
    case "manual":
      return "暂无手册数据";
    default:
      return defaultMessage;
  }
};

interface CategoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: DrawerItem[];
  onSelect: (item: DrawerItem, index: number) => void;
  selectedCategory: string;
  emptyMessage?: string;
  type: DrawerType;
}

export const CategoriesDrawer: React.FC<CategoriesDrawerProps> = ({
  isOpen,
  onClose,
  title,
  items,
  onSelect,
  selectedCategory,
  emptyMessage = "该分类下暂无地点",
  type,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      hideCloseButton
    >
      <DrawerContent className="max-h-[75vh] min-h-[40vh] rounded-t-2xl border-t bg-white">
        <DrawerHeader className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
              <MapPinIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {title}
              </h3>
              <Chip size="sm" variant="flat" color="primary" className="mt-1">
                {selectedCategory}
              </Chip>
            </div>
          </div>

          <Button isIconOnly size="sm" variant="light" onPress={onClose}>
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-y-auto px-4 py-4 bg-white">
          {items.length === 0 ? (
            <EmptyMessage type={type} emptyMessage={emptyMessage} />
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <BuildingCard
                  key={item.id || index}
                  item={item}
                  onSelect={() => {
                    onSelect(item, index);
                    onClose();
                  }}
                />
              ))}
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const BuildingCard = ({ item, onSelect }: { item: DrawerItem; onSelect: () => void }) => {
  return (
    <Card isPressable onPress={onSelect} className="w-full border">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <MapPinIcon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h4 className="text-base font-semibold text-gray-800 truncate">
              {item.name}
            </h4>
            {item.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}
            <BuildingFunctions functions={item.functions} />
            {item.categoryLabel && (
              <Chip size="sm" variant="flat" color="default">
                {item.categoryLabel}
              </Chip>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const BuildingFunctions = ({ functions }: { functions?: string[] }) => {
  if (!functions || functions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {functions.slice(0, 4).map((func: string, idx: number) => (
        <Chip
          key={idx}
          size="sm"
          variant="flat"
          className="glass-chip text-blue-600 flex-shrink-0"
        >
          {func}
        </Chip>
      ))}
      {functions.length > 4 && (
        <Chip
          size="sm"
          variant="flat"
          className="glass-chip text-gray-500 flex-shrink-0"
        >
          +{functions.length - 4}
        </Chip>
      )}
    </div>
  );
};

const EmptyMessage = ({
  type,
  emptyMessage,
}: {
  type: DrawerType;
  emptyMessage: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <MapPinIcon className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-600">
        {getEmptyMessage(type, emptyMessage)}
      </p>
    </div>
  );
};
