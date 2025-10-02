import { Button } from '@heroui/react';

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
      icon: '/icons/定位.svg',
      label: '定位',
      onClick: onLocationClick,
    },
    {
      icon: '/icons/新生手册.svg',
      label: '手册',
      onClick: onManualClick,
    },
    {
      icon: '/icons/校车.svg',
      label: '校车',
      onClick: onSchoolCarClick,
    },
    {
      icon: '/icons/问答.svg',
      label: '问答',
      onClick: onChatClick,
    },
  ];

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="flat"
          size="sm"
          onPress={button.onClick}
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 w-auto bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl"
          startContent={
            <img
              src={button.icon}
              alt={button.label}
              className="w-4 h-4"
            />
          }
        >
          <span className="text-xs text-blue-700">{button.label}</span>
        </Button>
      ))}
    </div>
  );
};
