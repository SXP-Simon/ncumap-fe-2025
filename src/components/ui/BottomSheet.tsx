import { Card, CardBody, Button, Chip } from "@heroui/react";
import { MapPinIcon } from '@heroicons/react/24/outline';

interface BottomSheetItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: BottomSheetItem[];
  onItemClick: (item: BottomSheetItem) => void;
  emptyMessage?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  items,
  onItemClick,
  emptyMessage = "暂无数据"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 max-h-[50vh] flex flex-col">
      {/* 顶部拖拽指示器 */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <MapPinIcon className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((item, index) => (
              <Card
                key={item.id || index}
                isPressable
                onPress={() => onItemClick(item)}
                className="border border-gray-200 hover:border-primary-300 transition-colors"
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    {item.icon && (
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                      )}
                      {item.category && (
                        <div className="mt-2">
                          <Chip size="sm" variant="flat" color="primary">
                            {item.category}
                          </Chip>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
