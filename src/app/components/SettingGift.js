import { useEffect, useState, useContext } from 'react';
import './SettingGift.css';
import GiftForm from './GiftForm';
import { drawDataContext } from '../drawDataContext';
import Button from './ui/Button';
const SettingGift = ({ moveToPreviousStep, doDraw, moveToNextStep }) => {
  const { drawData, setDrawData } = useContext(drawDataContext);
  const [gifts, setGifts] = useState(
    Array.from({ length: drawData.winnerCount }).map((_, index) => {
      return { id: index, giftName: '', giftFile: new File([], '파일 이름') };
    })
  );
  const [errorsArray, setErrorsArray] = useState(
    Array.from({ length: drawData.winnerCount }).map(() => {
      return { name: 'none', file: 'none' };
    })
  );
  const isValidImageFilename = (filename) => {
    const maxNonNamePartLength = 4;
    const filenameValidationRegex =
      /\.JPG$|\.jpg$|\.jpeg$|\.JPEG$|\.png$|\.PNG$/;
    if (filename.length < maxNonNamePartLength) {
      return false;
    }
    if (filenameValidationRegex.test(filename) === false) {
      return false;
    }
    return true;
  };
  const isValidGiftName = (giftName) => {
    const nameValidationRegex = /^([a-zA-Zㄱ-ㅎ가-힣 0-9]{1,})$/;
    if (nameValidationRegex.test(giftName) === false) {
      return false;
    }
    return true;
  };
  const checkFormError = (formData, mode = 'no-gift') => {
    const nowErrors = {
      name: 'none',
      file: 'none',
    };
    if (isValidGiftName(formData.giftName) === false) {
      nowErrors.name = 'name_wrong_character';
    }
    if (isValidImageFilename(formData.giftFile.name) === false) {
      nowErrors.file = 'invalid_file';
    }
    if (formData.giftFile.size > 1000000) {
      nowErrors.file = 'invalid_file';
    }
    if (
      formData.giftFile.size === 0 &&
      formData.giftFile.name === '파일 이름'
    ) {
      nowErrors.file = 'no_file';
    }
    return nowErrors;
  };
  const onClickPreviousButton = () => {
    setDrawData({ ...drawData, giftArray: [] });
    moveToPreviousStep();
  };

  const onClickDrawButton = () => {
    const nowErrorsArray = gifts.map((gift) => checkFormError(gift));
    const isErrorOccured = nowErrorsArray.some((errors) =>
      Object.values(errors).some((error) => error != 'none')
    );
    setErrorsArray(nowErrorsArray);
    if (isErrorOccured) {
      return;
    }
    setDrawData({ ...drawData, giftArray: gifts });
  };
  useEffect(() => {
    if (drawData.giftArray.length > 0) {
      doDraw(false);
      moveToNextStep();
    }
  }, [drawData, doDraw, moveToNextStep]);

  return (
    <div className='setting_block SettingGift'>
      <p className='setting_label'>추첨설정</p>
      <p className='step_label'>경품 정하기</p>
      <div className='form_wrapper'>
        {gifts.map((gift, index) => {
          return (
            <GiftForm
              key={index}
              gifts={gifts}
              setGifts={setGifts}
              formIndex={gift.id}
              errors={errorsArray[index]}
            />
          );
        })}
      </div>
      <div className='button_wrapper'>
        <Button type={'backward_button'} onClick={onClickPreviousButton}>
          이전
        </Button>
        <Button type={'forward_button'} onClick={onClickDrawButton}>
          추첨하기
        </Button>
      </div>
    </div>
  );
};

export default SettingGift;
