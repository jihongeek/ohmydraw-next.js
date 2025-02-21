import './SettingCount.css';
import { useContext, useState } from 'react';
import { drawDataContext } from '../drawDataContext';
import Button from './ui/Button';
import TextInput from './ui/TextInput';
import ErrorMessage from './ui/ErrorMessage';
import FileUpload from './FileUpload';

function SettingCount({ moveToPreviousStep, moveToNextStep }) {
  const { drawData, setDrawData } = useContext(drawDataContext);
  const [drawCounts, setDrawCounts] = useState({
    participant: drawData.participantCount,
    winner: drawData.winnerCount,
  });
  const [nowParticipantCount, nowWinnerCount] = [
    drawCounts.participant,
    drawCounts.winner,
  ];

  const [errors, setErrors] = useState({
    participant: 'none',
    winner: 'none',
  });
  const errorMessages = {
    participant: {
      out_of_range: '참가자 수는 1 ~ 50명 사이 이어야 합니다.',
    },
    winner: {
      out_of_range:
        '당첨자 수는 1명 보다 많고, 참가자 수 보다 같거나 작아야 합니다.',
    },
  };

  const [participantFileName, setFileName] = useState('');

  const onClickNextButton = () => {
    // 참가자 수, 당첨자 수가 범위를 벗어날 경우
    if (!(0 < nowParticipantCount && nowParticipantCount <= 50)) {
      setErrors({ ...errors, participant: 'out_of_range' });
      return;
    }
    setErrors({ ...errors, participant: 'none' });
    if (!(0 < nowWinnerCount && nowWinnerCount <= nowParticipantCount)) {
      setErrors({ ...errors, winner: 'out_of_range' });
      return;
    }
    setErrors({ ...errors, winner: 'none' });
    setDrawData({
      ...drawData,
      participantCount: nowParticipantCount,
      winnerCount: nowWinnerCount,
    });
    moveToNextStep();
  };

  const onClickPreviousButton = () => {
    setDrawData({ ...drawData, participantCount: 0, winnerCount: 0 });
    moveToPreviousStep();
  };
  const onParticipantCountChange = (e) => {
    if (isNaN(parseInt(e.target.value))) {
      setDrawCounts({ ...drawCounts, participant: '' });
    } else {
      setDrawCounts({ ...drawCounts, participant: parseInt(e.target.value) });
    }
  };
  const onWinnerCountChange = (e) => {
    if (isNaN(parseInt(e.target.value))) {
      setDrawCounts({ ...drawCounts, winner: 0 });
    } else {
      setDrawCounts({ ...drawCounts, winner: parseInt(e.target.value) });
    }
  };
  const onListFileUpload = async (e) => {
    const participantArray = [];
    setFileName(e.target.files[0].name);
    const csv = await e.target.files[0].text();
    const csvLines = csv.split('\r\n');
    const csvHeader = csvLines[0].split(',');
    const columnIndex = {
      Email: 0,
      'Last Name': 0,
      'First Name': 0,
    };
    for (let i = 0; i < csvHeader.length; i++) {
      if (csvHeader[i] === 'Email') {
        columnIndex['Email'] = i;
      }
      if (csvHeader[i] === 'Last Name') {
        columnIndex['Last Name'] = i;
      }
      if (csvHeader[i] === 'First Name') {
        columnIndex['First Name'] = i;
      }
    }
    for (let i = 1; i < csvLines.length; i++) {
      if (csvLines[i] === '') continue;
      const csvLine = csvLines[i].split(',');
      participantArray.push({
        id: participantArray.length,
        email: csvLine[columnIndex['Email']],
        name: `${csvLine[columnIndex['Last Name']]} ${csvLine[columnIndex['First Name']]}`,
        isWon: false,
      });
    }
    setDrawData({ ...drawData, participantArray: participantArray });
    setDrawCounts({ ...drawCounts, participant: participantArray.length });
  };
  return (
    <div className='setting_block SettingCount'>
      <p className='setting_label'>추첨설정</p>
      <p className='step_label'>인원 정하기</p>
      <div className='form_wrapper'>
        <div className='participant_count_wrapper'>
          <label className='form_label participant' htmlFor='participant_count'>
            참가인원
          </label>
          <TextInput
            id={'participant_count'}
            type={'number'}
            value={nowParticipantCount}
            onChange={onParticipantCountChange}
            hasError={errors.participant !== 'none'}
          />
          <ErrorMessage
            type={'name'}
            errorType={errors.participant}
            errorMessages={errorMessages.participant}
          />
          <label className='form_label' htmlFor='list_upload'>
            참가 인원 리스트
          </label>
          <FileUpload
            id={'list_upload'}
            fileName={participantFileName}
            onGiftFileChange={onListFileUpload}
            hasError={false}
            accept={'text/csv'}
          />
        </div>

        <div className='winner_count_wrapper'>
          <label className='form_label winner' htmlFor='winner_count'>
            당첨자
          </label>
          <TextInput
            id={'winner_count'}
            type={'number'}
            defaultValue={nowWinnerCount}
            onChange={onWinnerCountChange}
            hasError={errors.winner !== 'none'}
          />
          <ErrorMessage
            type={'winner'}
            errorType={errors.winner}
            errorMessages={errorMessages.winner}
          />
        </div>
      </div>
      <div className='button_wrapper'>
        <Button type={'backward_button'} onClick={onClickPreviousButton}>
          이전
        </Button>
        <Button type={'forward_button'} onClick={onClickNextButton}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default SettingCount;
