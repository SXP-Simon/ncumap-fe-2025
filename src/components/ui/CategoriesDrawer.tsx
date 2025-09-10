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
import type { UIListItem } from "@/types/activity";

export type DrawerType = "location" | "activity" | "manual";

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
  type,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      hideCloseButton={true}
      className="[&_[data-slot=backdrop]]:glass-modal-backdrop"
    >
      <DrawerContent className="glass-base glass-container-lg max-h-[75vh] min-h-[50vh] rounded-t-2xl overflow-hidden">
        <DrawerHeader className="flex items-center justify-between px-5 py-4 glass-header relative z-20">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="glass-icon-container-lg flex-shrink-0">
              <MapPinIcon className="w-5 h-5 text-blue-500 drop-shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 drop-shadow-lg truncate">
                {title}
              </h3>
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
            onPress={onClose}
            className="glass-button"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-y-auto px-4 py-4 relative z-10 bg-white/2 backdrop-blur-xl max-h-[calc(75vh-10rem)]">
          {buildings.length === 0 ? (
            <EmptyMessage type={type} emptyMessage={emptyMessage} />
          ) : (
            <div className="space-y-3 w-full">
              {buildings.map((building, index) => (
                <BuildingCard
                  key={building.id || index}
                  building={building}
                  index={index}
                  onSelect={() => {
                    onBuildingSelect(building, index);
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

interface BuildingCardProps {
  building: UIListItem;
  index: number;
  onSelect: () => void;
}

const BuildingCard = ({ building, onSelect }: BuildingCardProps) => {
  return (
    <Card
      isPressable
      onPress={onSelect}
      className="glass-base glass-card group w-full"
    >
      <CardBody className="p-5 relative z-10">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="glass-icon-container-sm flex-shrink-0">
              <MapPinIcon className="w-4 h-4 text-blue-500" />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <h4 className="text-lg font-bold text-gray-800 truncate">
                {building.name}
              </h4>

              {building.info && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {building.info}
                </p>
              )}

              <BuildingFunctions functions={building.functions} />
            </div>
          </div>

          <div className="glass-button-sm ml-4 flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-lg"></div>
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
    <div className="flex flex-col items-center justify-center py-20 glass-base glass-container relative overflow-hidden">
      <div className="glass-icon-container w-24 h-24 flex-center mb-6">
        <MapPinIcon className="w-12 h-12 text-gray-400 drop-shadow-lg" />
      </div>
      <p className="text-lg font-medium text-gray-600 drop-shadow-sm">
        {getEmptyMessage(type, emptyMessage)}
      </p>
    </div>
  );
};
