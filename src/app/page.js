'use client'
import './App.css';
import SettingCount from './components/SettingCount';
import SettingParticipant from './components/SettingParticipant';
import SettingGift from './components/SettingGift'
import SettingMode from './components/SettingMode'
import Draw from './components/Draw'
import { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [drawData, setDrawData] = useState({
    sendKey : "",
    mode : "no-gift",
    participantCount: 0,
    winnerCount: 0,
    nowRound: -1,
    nowWinnerId: -1,
    pickedIndex: -1,
    participantArray: [],
    giftArray: []
  });

  const moveStep = (stepIndex) => {
    setStepIndex(stepIndex);
  }  
  const moveToNextStep = () => {
    setStepIndex(stepIndex + 1);
  }
  const moveToPreviousStep = () => {
    setStepIndex(stepIndex - 1);
  }
  const pickParticipantIndex = (participantCount) => {
    return Math.floor(Math.random() * (participantCount - 0)) + 0
  }
  /**
   *당첨자 추첨 함수
   * @param {boolean} isRedraw 
   * @param {Array} participantCount 
   */
  const doDraw = (isRedraw, participantArray = drawData.participantArray) => {
    const nextRound = isRedraw === false ? drawData.nowRound + 1 : drawData.nowRound
    const pickedIndex = pickParticipantIndex(participantArray.length);
    setDrawData({
      ...drawData,
      nowRound: nextRound,
      nowWinnerId: participantArray[pickedIndex].id,
      pickedIndex: pickedIndex
    })

  }
  return (
    <div className="App">
      <Image src="/logo.svg" height={241} width={468} alt="오마이드로우 로고" />
      {
        {

          0: <SettingMode
            moveToNextStep={moveToNextStep}
            drawData={drawData}
            setDrawData={setDrawData}
          />,
          1: <SettingCount
            moveToNextStep={moveToNextStep}
            moveToPreviousStep={moveToPreviousStep}
            drawData={drawData}
            setDrawData={setDrawData}
          />,
          2: <SettingParticipant
            moveToNextStep={moveToNextStep}
            moveToPreviousStep={moveToPreviousStep}
            moveStep={moveStep}
            drawData={drawData}
            doDraw = {doDraw}
            setDrawData={setDrawData}
          />,
          3: <SettingGift
            moveToPreviousStep={moveToPreviousStep}
            moveToNextStep={moveToNextStep}
            drawData={drawData}
            doDraw={doDraw}
            setDrawData={setDrawData}
          />,
          4: <Draw
            drawData={drawData}
            doDraw={doDraw}
            setDrawData={setDrawData}
          />
        }[stepIndex]
      }
    </div>
  );
}
