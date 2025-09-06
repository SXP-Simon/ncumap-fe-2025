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
    <div className="fixed right-3 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-2">
      {buttons.map((button, index) => {
        const IconComponent = button.icon;
        return (
          <div 
            key={index}
            className="relative group"
          >
            {/* 深度玻璃拟物化容器 */}
            <div className="
              relative w-14 h-16 
              bg-gradient-to-br from-white/20 via-white/10 to-white/5
              backdrop-blur-2xl border border-white/20
              rounded-2xl shadow-2xl shadow-black/20
              hover:shadow-3xl hover:shadow-black/30
              before:absolute before:inset-[1px] before:rounded-2xl
              before:bg-gradient-to-br before:from-white/10 before:to-transparent
              after:absolute after:inset-0 after:rounded-2xl
              after:bg-gradient-to-t after:from-black/5 after:to-transparent
              transition-all duration-400 ease-out
              hover:scale-105 hover:bg-white/15
              flex flex-col items-center justify-center gap-0.5 py-2
            ">
              {/* 内层发光效果 */}
              <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
              
              {/* 图标按钮 */}
              <Button
                isIconOnly
                color={button.color}
                variant="light"
                size="sm"
                onPress={button.onClick}
                className="
                  relative z-10 w-8 h-8 
                  bg-gradient-to-br from-white/20 to-white/5
                  border border-white/20 shadow-inner shadow-white/10
                  hover:bg-white/30 hover:border-white/30
                  hover:shadow-lg hover:shadow-black/10
                  transition-all duration-300 ease-out
                  rounded-xl backdrop-blur-sm
                  before:absolute before:inset-0 before:rounded-xl
                  before:bg-gradient-to-t before:from-transparent before:to-white/10
                  min-w-0 min-h-0
                "
                aria-label={button.label}
              >
                <IconComponent className="w-4 h-4 drop-shadow-sm" />
              </Button>
              
              {/* 紧凑文字标签 */}
              <span className="
                relative z-10 text-[10px] font-medium text-gray-800/90
                leading-none tracking-tight select-none
                group-hover:text-gray-900 group-hover:font-semibold
                transition-all duration-300 drop-shadow-sm
                whitespace-nowrap px-1
              ">
                {button.label}
              </span>
            </div>
            
            {/* 高级光晕和反射效果 */}
            <div className="
              absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100
              bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10
              blur-lg transition-opacity duration-500 -z-10
            "></div>
            
            {/* 顶部高光反射 */}
            <div className="
              absolute top-1 left-1/4 right-1/4 h-px
              bg-gradient-to-r from-transparent via-white/40 to-transparent
              rounded-full blur-sm opacity-80
            "></div>
            
            {/* 侧边玻璃反射 */}
            <div className="
              absolute left-1 top-1/4 bottom-1/4 w-px
              bg-gradient-to-b from-transparent via-white/20 to-transparent
              rounded-full opacity-60
            "></div>
          </div>
        );
      })}
    </div>
  );
};
