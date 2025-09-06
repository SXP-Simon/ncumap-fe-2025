import { useCallback } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';
import { SimpleModal } from './SimpleModal';
import { Image } from '@heroui/react';

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
    <SimpleModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* 标题 */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <TruckIcon className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">校车信息</h2>
        </div>
        
        {/* 图片区域 */}
        <div className="flex justify-center">
          <div 
            onClick={handleImageClick}
            className="cursor-pointer transition-all duration-300 hover:scale-105 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-6 bg-gradient-to-b from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow-lg"
          >
            <Image
              src={currentNumber === 0 ? "/schoolCar.svg" : "/schoolCar1.svg"}
              alt="校车信息"
              width={600}
              height={400}
              className="rounded-lg pointer-events-none"
            />
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};
