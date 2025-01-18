import ParticipantForm from "./ParticipantForm";
import './SettingParticipant.css';
import { drawDataContext } from "../drawDataContext";
import {useState,useEffect,useContext} from 'react';
import Button from "./ui/Button";
const SettingParticiant = ({moveToNextStep,moveToPreviousStep,moveStep,doDraw}) => {
    const {drawData,setDrawData} = useContext(drawDataContext);
    const formIndexArray = [...Array(drawData.participantCount)].map((x,index) => index);
    const [errorDataArray,setErrorData] = useState(formIndexArray.map(() => { return {nameErrorStatus : "none", emailErrorStatus : "none"}}));
    const [participantDataArray,setParticipantData] = useState(
        formIndexArray.map(x => { 
            if (drawData.participantArray.length > 0)
                return drawData.participantArray[x];
            return { id : x, name : "", email : "", isWon : false};
        }))
    const checkFormError = (formData,drawMode)=> {
        const nameValidationRegex = /^([a-zA-Zㄱ-ㅎ가-힣 0-9]{1,})$/;
        const emailValidationRegex = /[a-zA-Z0-9][a-zA-Z0-9_-]{0,20}@[a-zA-Z0-9]{1,}\.[a-zA-Z0-9]{1,}/
        const errorData = {
            isErrorOccured : false,
            nameErrorStatus : "none",
            emailErrorStatus : "none"
        }

        if (nameValidationRegex.test(formData.name) === false)
        {
            errorData.isErrorOccured = true;    
            errorData.nameErrorStatus = "name_wrong_character";    
        }
        if (drawMode === "gift" && emailValidationRegex.test(formData.email) === false)
        {
            errorData.isErrorOccured = true;    
            errorData.emailErrorStatus = "email_invalid";    
        }
        return errorData;
    }

    const onClickNextButton = () => { 
        let isErrorOccured = false
        setErrorData(errorDataArray.map((errorData, index) => {
            const errorDataToUpdate = checkFormError(participantDataArray[index],drawData.mode);
            // 지금까지 에러가 발생하지 않았다면, 현재 에러 상태 확인해서 업데이트
            if (isErrorOccured === false)
            {
                isErrorOccured = errorDataToUpdate.isErrorOccured;
            }     
            return {
                emailErrorStatus : errorDataToUpdate.emailErrorStatus,
                nameErrorStatus : errorDataToUpdate.nameErrorStatus
            };
        }));
        if (isErrorOccured)
        {
            return;
        }
        setDrawData({
            ...drawData,
            participantArray : participantDataArray
        })
        if (drawData.mode !== "no-gift")
        {
            moveToNextStep();
        }
    }
    const onClickPreviousButton = () => {
        setDrawData({...drawData,participantArray : []});
        moveToPreviousStep();
    }

    useEffect(() => {
        if (drawData.mode === "no-gift" &&  drawData.participantArray.length > 0)
        {
            doDraw(false);
            moveStep(4);
        }
    }
        ,[drawData,doDraw,moveStep]        
    )
    return (
        <div className = "setting_block SettingParticipant">
            <p className="setting_label">추첨설정</p>
            <p className="step_label">참가인원 정보</p>
            <div className = "form_wrapper">
                {
                    participantDataArray.map((x,index) => {
                        return <ParticipantForm 
                        errorData={errorDataArray[index]}
                        participantDataArray = {participantDataArray} 
                        setParticipantData = {setParticipantData}  
                        nowIndex = {index} key={index}
                        mode={drawData.mode}
                        />
                    })
                }
            </div>
            <div className ="button_wrapper">
                <button className = "backward_button previous" onClick = {onClickPreviousButton}>이전</button>
                {drawData.mode === "gift" ? <Button type={'forward_button'} onClick={onClickNextButton}>다음</Button> : ''}
                {drawData.mode === "no-gift" ? <Button type={'forward_button'} onClick={onClickNextButton}>추첨하기</Button> : ''}
            </div>
        </div>
    );
}

export default SettingParticiant;