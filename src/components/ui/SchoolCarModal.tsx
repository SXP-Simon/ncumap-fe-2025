import { useCallback } from 'react';
import { TruckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react';

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
      hideCloseButton
    >
      <ModalContent className="max-w-xs mx-auto my-auto">
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between px-3 py-2 border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                  <TruckIcon className="w-4 h-4 text-blue-500" />
                </div>
                <h2 className="text-base font-semibold text-gray-800">校车信息</h2>
              </div>
              
              <Button isIconOnly size="sm" variant="light" onPress={onClose}>
                <XMarkIcon className="w-4 h-4 text-gray-600" />
              </Button>
            </ModalHeader>

            <ModalBody className="px-3 py-3">
              <div className="text-center space-y-3">
                <div onClick={handleImageClick} className="cursor-pointer">
                  <img
                    src={currentNumber === 0 ? "/schoolCar.svg" : "/schoolCar1.svg"}
                    alt="校车信息"
                    className="w-full rounded-lg"
                    onError={(e) => {
                      console.error('SchoolCar image failed to load:', e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex justify-center gap-2">
                  {[0, 1].map((route) => (
                    <button
                      key={route}
                      type="button"
                      onClick={() => onSchoolCarNumberChange(route.toString())}
                      className={`h-2 w-6 rounded-full ${currentNumber === route ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">点击图片切换路线</p>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
