import { Button } from "@heroui/react";
import { MapPinIcon, BookOpenIcon, TruckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

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
  onChatClick
}) => {
  const buttons = [
    {
      icon: MapPinIcon,
      label: "定位",
      onClick: () => {
        console.log('定位按钮被点击');
        onLocationClick();
      },
      color: "primary" as const
    },
    {
      icon: BookOpenIcon,
      label: "手册",
      onClick: () => {
        console.log('手册按钮被点击');
        onManualClick();
      },
      color: "secondary" as const
    },
    {
      icon: TruckIcon,
      label: "校车",
      onClick: () => {
        console.log('校车按钮被点击');
        onSchoolCarClick();
      },
      color: "success" as const
    },
    {
      icon: ChatBubbleLeftRightIcon,
      label: "问答",
      onClick: () => {
        console.log('问答按钮被点击');
        onChatClick();
      },
      color: "warning" as const
    }
  ];

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-3">
      {buttons.map((button, index) => {
        const IconComponent = button.icon;
        return (
          <Button
            key={index}
            isIconOnly
            color={button.color}
            variant="shadow"
            size="lg"
            onPress={button.onClick}
            className="w-14 h-14 shadow-lg"
            aria-label={button.label}
          >
            <IconComponent className="w-6 h-6" />
          </Button>
        );
      })}
    </div>
  );
};
