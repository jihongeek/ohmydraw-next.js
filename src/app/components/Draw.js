import './Draw.css';
import { useState, useContext } from 'react';
import { drawDataContext } from '../drawDataContext';
import Button from './ui/Button';
const Draw = ({ doDraw }) => {
  const { drawData, setDrawData } = useContext(drawDataContext);
  const [sendStatus, setSendStatus] = useState('ready');
  const nowParticipants = drawData.participantArray.filter(
    (participant) => participant.isWon === false
  );
  const leftParticipants = drawData.participantArray.map(
    (participant, index) => {
      if (index === drawData.nowWinnerId) {
        return { ...participant, isWon: true };
      }
      return participant;
    }
  );
  const nowGifts = [...drawData.giftArray];
  const sendStatusMessages = {
    ready: { text: '준비완료', color: 'inherit' },
    sending: { text: '하는 중', color: 'inherit' },
    success: { text: '성공', color: '#4DF472' },
    failed: { text: '실패', color: '#E63535' },
  };
  const reader = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = (err) => reject(err);
      fr.readAsDataURL(file);
    });
  const onClickSendGiftButton = async () => {
    setSendStatus('sending');
    const giftFileBase64 = await reader(drawData.giftArray[0].giftFile);
    const winner = drawData.participantArray[drawData.nowWinnerId];
    const sendGiftResponse = await fetch('/sent-gifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        winnerEmail: winner.email,
        winnerName: winner.name,
        giftName: drawData.giftArray[0].giftName,
        giftFile: giftFileBase64,
        giftFileName: drawData.giftArray[0].giftFile.name,
        sendKey: drawData.sendKey,
      }),
    });
    if (sendGiftResponse.status !== 201) {
      setSendStatus('failed');
      return;
    }
    nowGifts.shift();
    setDrawData({
      ...drawData,
      participantArray: leftParticipants,
      giftArray: nowGifts,
    });
    setSendStatus('success');
  };
  const onClickDrawNextButton = () => {
    setSendStatus('ready');
    setDrawData({ ...drawData, participantArray: leftParticipants });
    doDraw(
      false,
      leftParticipants.filter((participant) => participant.isWon === false)
    );
  };
  return (
    <div className='Draw'>
      {drawData.mode === 'gift' ? (
        <p className='send_gift_response_label'>
          경품 발송
          <span
            style={{
              fontWeight: 'bold',
              color: sendStatusMessages[sendStatus].color,
            }}
          >
            {'  ' + sendStatusMessages[sendStatus].text}
          </span>
        </p>
      ) : (
        ''
      )}
      <div className='winner_wrapper'>
        <p className='winner_name'>
          {drawData.participantArray[drawData.nowWinnerId].name}
        </p>
        <p className='win_label'>당첨</p>
      </div>
      <div className='button_wraper'>
        {nowParticipants.length > 1 && sendStatus !== 'success' ? (
          <Button
            type={'backward_button'}
            onClick={() => doDraw(true, nowParticipants)}
          >
            다시추첨
          </Button>
        ) : (
          ''
        )}
        {nowGifts.length > 0 &&
        drawData.mode === 'gift' &&
        sendStatus !== 'success' ? (
          <Button type={'forward_button'} onClick={onClickSendGiftButton}>
            경품발송
          </Button>
        ) : (
          ''
        )}
        {nowParticipants.length > 1 &&
        (drawData.mode === 'no-gift' || sendStatus === 'success') ? (
          <Button type={'forward_button'} onClick={onClickDrawNextButton}>
            다음추첨
          </Button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Draw;
