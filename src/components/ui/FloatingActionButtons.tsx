import { Button } from '@heroui/react';
import {
  MapPinIcon,
  BookOpenIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface FloatingActionButtonsProps {
  onLocationClick: () => void;
  onManualClick: () => void;
  onSchoolCarClick: () => void;
  onChatClick: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onLocationClick,
  onManualClick,
  onSchoolCarClick,
  onChatClick,
}) => {
  const buttons = [
    {
      icon: MapPinIcon,
      label: '定位',
      onClick: onLocationClick,
    },
    {
      icon: BookOpenIcon,
      label: '手册',
      onClick: onManualClick,
    },
    {
      icon: TruckIcon,
      label: '校车',
      onClick: onSchoolCarClick,
    },
    {
      icon: ChatBubbleLeftRightIcon,
      label: '问答',
      onClick: onChatClick,
    },
  ];

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
      {buttons.map((button, index) => {
        const IconComponent = button.icon;
        return (
          <div key={index} className="flex flex-col items-center gap-1">
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              onPress={button.onClick}
              aria-label={button.label}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-700">{button.label}</span>
          </div>
        );
      })}
    </div>
  );
};
