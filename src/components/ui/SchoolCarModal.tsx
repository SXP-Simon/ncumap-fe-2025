import { useCallback } from 'react';
import { Modal, ModalContent, Button } from '@heroui/react';

interface SchoolCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCarNumber: string;
  onSchoolCarNumberChange: (value: string) => void;
}

export const SchoolCarModal: React.FC<SchoolCarModalProps> = ({
  isOpen,
  onClose,
  schoolCarNumber,
  onSchoolCarNumberChange,
}) => {
  const currentNumber = Number(schoolCarNumber) || 0;

  const handleImageClick = useCallback(() => {
    const newNumber = currentNumber === 0 ? 1 : 0;
    onSchoolCarNumberChange(newNumber.toString());
  }, [currentNumber, onSchoolCarNumberChange]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="full"
      placement="center"
      hideCloseButton
      classNames={{
        base: "bg-transparent",
        backdrop: "bg-black/50",
      }}
    >
      <ModalContent className="bg-transparent shadow-none max-w-none w-auto h-auto m-0">
        {() => (
          <div className="relative">
            {/* 左上角返回按钮 - 覆盖图片中的返回图标位置 */}
            <div
              className="absolute top-4 left-4 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                isIconOnly
                variant="flat"
                onPress={onClose}
                className="w-11 h-11 bg-transparent hover:bg-white/20 rounded-full"
              >
                <img src="/back.svg" alt="返回" className="w-6 h-6" />
              </Button>
            </div>

            {/* 校车图片 - 点击切换 */}
            <div onClick={handleImageClick} className="cursor-pointer">
              <img
                src={currentNumber === 0 ? '/schoolCar.svg' : '/schoolCar1.svg'}
                alt="校车信息"
                className="max-w-full max-h-screen object-contain"
                onError={(e) => {
                  console.error('SchoolCar image failed to load:', e.currentTarget.src);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
