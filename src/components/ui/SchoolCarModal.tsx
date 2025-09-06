import { useCallback } from 'react';
import { TruckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react';

interface SchoolCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolCarNumber: string;
  onSchoolCarNumberChange: (value: string) => void;
  onConfirm: () => void;
}

export const SchoolCarModal: React.FC<SchoolCarModalProps> = ({
  isOpen,
  onClose,
  schoolCarNumber,
  onSchoolCarNumberChange
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
      size="sm"
      placement="center"
      hideCloseButton={true}
      className="[&_[data-slot=backdrop]]:glass-modal-backdrop"
    >
      <ModalContent className="glass-base glass-container max-w-xs mx-auto my-auto">
        {(onClose) => (
          <>
            <ModalHeader className="glass-header flex items-center justify-between px-3 py-2 relative z-20">
              <div className="flex items-center gap-2 flex-1">
                <div className="glass-icon-container p-1.5">
                  <TruckIcon className="w-4 h-4 text-blue-500 drop-shadow-lg" />
                </div>
                <h2 className="text-base font-bold text-gray-800 drop-shadow-lg">校车信息</h2>
              </div>
              
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={onClose}
                className="glass-button-sm"
              >
                <XMarkIcon className="w-4 h-4 text-gray-600" />
              </Button>
            </ModalHeader>

            <ModalBody className="px-3 py-3 relative z-10 bg-white/2 backdrop-blur-xl">
              <div className="text-center">
                {/* 图片区域 - 紧凑版本 */}
                <div className="flex justify-center mb-3">
                  <div 
                    onClick={handleImageClick}
                    className="glass-base glass-card group cursor-pointer w-full p-3"
                  >
                    <img
                      src={currentNumber === 0 ? "/schoolCar.svg" : "/schoolCar1.svg"}
                      alt="校车信息"
                      className="
                        w-full h-auto rounded-lg relative z-10
                        transition-all duration-300 ease-out
                        group-hover:scale-105 drop-shadow-lg
                      "
                      onError={(e) => {
                        console.error('SchoolCar image failed to load:', e.currentTarget.src);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('SchoolCar image loaded successfully:', currentNumber === 0 ? "/schoolCar.svg" : "/schoolCar1.svg");
                      }}
                    />

                    {/* 交互提示 */}
                    <div className="glass-chip absolute bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      点击切换路线
                    </div>
                  </div>
                </div>

                {/* 路线指示器 - 紧凑版本 */}
                <div className="flex justify-center gap-1.5">
                  {[0, 1].map((route) => (
                    <div
                      key={route}
                      onClick={() => onSchoolCarNumberChange(route.toString())}
                      className={`
                        w-2.5 h-2.5 rounded-full cursor-pointer border border-white/20
                        transition-all duration-300
                        ${currentNumber === route 
                          ? 'bg-blue-500 shadow-lg shadow-blue-500/30 scale-125' 
                          : 'bg-white/20 hover:bg-white/30 hover:scale-110'
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
