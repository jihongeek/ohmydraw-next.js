'use client'
import './App.css';
import SettingCount from './components/SettingCount';
import SettingParticipant from './components/SettingParticipant';
import SettingGift from './components/SettingGift'
import SettingMode from './components/SettingMode'
import Draw from './components/Draw'
import { useState } from 'react';
import Image from "next/image";
import {drawDataContext} from './drawDataContext.js';
export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [drawData, setDrawData] = useState({
    sendKey : "",
    mode : "gift",
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
    return Math.floor(Math.random() * participantCount)
  }
  /**
   *당첨자 추첨 함수
   * @param {boolean} isRedraw 
   * @param {Array} participantCount 
   */
  const doDraw = (isRedraw, participantArray = drawData.participantArray) => {
    let nextRound = drawData.nowRound;
    if (!isRedraw) nextRound += 1; 
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
      <Image priority={true} src="/logo.svg" height={241} width={468} alt="오마이드로우 로고" />
      <drawDataContext.Provider value={{drawData:drawData,setDrawData:setDrawData}}>
      {
        {

          0: <SettingMode
            moveToNextStep={moveToNextStep}
          />,
          1: <SettingCount
            moveToNextStep={moveToNextStep}
            moveToPreviousStep={moveToPreviousStep}
          />,
          2: <SettingParticipant
            moveToNextStep={moveToNextStep}
            moveToPreviousStep={moveToPreviousStep}
            moveStep={moveStep}
            doDraw = {doDraw}
          />,
          3: <SettingGift
            moveToPreviousStep={moveToPreviousStep}
            moveToNextStep={moveToNextStep}
            doDraw={doDraw}
          />,
          4: <Draw
            doDraw={doDraw}
          />
        }[stepIndex]
      }

      </drawDataContext.Provider>
    </div>
  );
}
