import { useState } from 'react';

export function useUIState() {
  const [isCategoriesSheetShow, setIsCategoriesSheetShow] = useState(false);
  const [isManualShow, setIsManualShow] = useState(false);
  const [isActivitiesSheetShow, setIsActivitiesSheetShow] = useState(false);
  const [schoolCarDialog, setSchoolCarDialog] = useState(false);
  const [schoolCarNumber, setSchoolCarNumber] = useState(0);
  const [bottomSheetSelected, setBottomSheetSelected] = useState(-1);

  return {
    isCategoriesSheetShow,
    setIsCategoriesSheetShow,
    isManualShow,
    setIsManualShow,
    isActivitiesSheetShow,
    setIsActivitiesSheetShow,
    schoolCarDialog,
    setSchoolCarDialog,
    schoolCarNumber,
    setSchoolCarNumber,
    bottomSheetSelected,
    setBottomSheetSelected,
  };
}
