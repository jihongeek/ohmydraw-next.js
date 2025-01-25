import ParticipantForm from './ParticipantForm';
import './SettingParticipant.css';
import { drawDataContext } from '../drawDataContext';
import { useState, useEffect, useContext } from 'react';
import Button from './ui/Button';
const SettingParticiant = ({
  moveToNextStep,
  moveToPreviousStep,
  moveStep,
  doDraw,
}) => {
  const { drawData, setDrawData } = useContext(drawDataContext);
  const [errorsArray, setErrorsArray] = useState(
    Array.from({ length: drawData.participantCount }).map((_) => {
      return { name: 'none', email: 'none' };
    })
  );
  const [participants, setParticipants] = useState(
    Array.from({ length: drawData.participantCount }).map((_, index) => {
      if (drawData.participantArray.length > 0)
        return drawData.participantArray[index];
      return { id: index, name: '', email: '', isWon: false };
    })
  );

  const checkFormError = (formData, drawMode) => {
    const nowErrors = {
      name: 'none',
      email: 'none',
    };
    const validationRegexes = {
      name: /^([a-zA-Zㄱ-ㅎ가-힣 0-9]{1,})$/,
      email: /[a-zA-Z0-9][a-zA-Z0-9_-]{0,20}@[a-zA-Z0-9]{1,}\.[a-zA-Z0-9]{1,}/,
    };

    if (validationRegexes.name.test(formData.name) === false) {
      nowErrors.name = 'name_wrong_character';
    }
    if (
      drawMode === 'gift' &&
      validationRegexes.email.test(formData.email) === false
    ) {
      nowErrors.email = 'email_invalid';
    }
    return nowErrors;
  };

  const onClickNextButton = () => {
    const nowErrorsArray = participants.map((participant) => {
      return checkFormError(participant, drawData.mode);
    });
    const isErrorOccured = nowErrorsArray.some((errors) =>
      Object.values(errors).some((error) => error != 'none')
    );
    setErrorsArray(nowErrorsArray);
    if (isErrorOccured) {
      return;
    }
    setDrawData({
      ...drawData,
      participantArray: participants,
    });
    if (drawData.mode !== 'no-gift') {
      moveToNextStep();
    }
  };
  const onClickPreviousButton = () => {
    setDrawData({ ...drawData, participantArray: [] });
    moveToPreviousStep();
  };

  useEffect(() => {
    if (drawData.mode === 'no-gift' && drawData.participantArray.length > 0) {
      doDraw(false);
      moveStep(4);
    }
  }, [drawData, doDraw, moveStep]);
  return (
    <div className='setting_block SettingParticipant'>
      <p className='setting_label'>추첨설정</p>
      <p className='step_label'>참가인원 정보</p>
      <div className='form_wrapper'>
        {participants.map((_, index) => {
          return (
            <ParticipantForm
              errors={errorsArray[index]}
              participants={participants}
              setParticipants={setParticipants}
              formIndex={index}
              key={index}
              mode={drawData.mode}
            />
          );
        })}
      </div>
      <div className='button_wrapper'>
        <button
          className='backward_button previous'
          onClick={onClickPreviousButton}
        >
          이전
        </button>
        {drawData.mode === 'gift' ? (
          <Button type={'forward_button'} onClick={onClickNextButton}>
            다음
          </Button>
        ) : (
          ''
        )}
        {drawData.mode === 'no-gift' ? (
          <Button type={'forward_button'} onClick={onClickNextButton}>
            추첨하기
          </Button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default SettingParticiant;
