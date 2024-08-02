import { useEffect, useState, useContext } from "react";
import "./SettingGift.css";
import GiftForm from "./GiftForm";
import { drawDataContext } from "../drawDataContext";

const SettingGift = ({ moveToPreviousStep,doDraw,moveToNextStep }) => {
    const {drawData,setDrawData} = useContext(drawDataContext);
    const [giftDataArray,setGiftData] = useState([...Array(drawData.winnerCount)].map(
        (_, index) => { return { id : index, giftName : "", giftFile : new File([],"파일 이름")} }
    ));
    const [errorDataArray,setErrorData] = useState(giftDataArray.map(() => { return {nameErrorStatus : "none", fileErrorStatus : "none"}}));    
    const maxNonNamePartLength = 4;
    const isValidImageFilename = (filename) => {
        const filenameValidationRegex = /\.JPG$|\.jpg$|\.jpeg$|\.JPEG$|\.png$|\.PNG$/
        if (filename.length < maxNonNamePartLength)
        {
            return false;
        }
        if (filenameValidationRegex.test(filename) === false)
        {
            return false;
        }
        return true;
    }
    const isValidGiftName = (giftName) => {
        const nameValidationRegex = /^([a-zA-Zㄱ-ㅎ가-힣 0-9]{1,})$/;
        if (nameValidationRegex.test(giftName) === false)
        {
            return false;
        }
        return true;
    }
    const checkFormError = (formData) => {
        const errorData = {
            isErrorOccured : false,
            nameErrorStatus : "none",
            fileErrorStatus : "none"

        }
        if (isValidGiftName(formData.giftName) === false)
        {
            errorData.isErrorOccured = true;
            errorData.nameErrorStatus = "name_wrong_character";
        }
        if (isValidImageFilename(formData.giftFile.name) === false)
        {
            errorData.isErrorOccured = true;
            errorData.fileErrorStatus = "invalid_file";
        }
        if (formData.giftFile.size > 1000000)
        {
            errorData.isErrorOccured = true;
            errorData.fileErrorStatus = "invalid_file";
        }
        if (formData.giftFile.size === 0 && formData.giftFile.name === "파일 이름")
        {
            errorData.isErrorOccured = true;
            errorData.fileErrorStatus = "no_file";
        }
        return errorData;
    }
    const onClickPreviousButton = () => {
        setDrawData({...drawData,giftArray:[]})
        moveToPreviousStep();
    }
    
    const onClickDrawButton = () => {
        let isErrorOccured = false;
        setErrorData(errorDataArray.map((errorData, index)=> {
            const errorDataToUpdate = checkFormError(giftDataArray[index]);
            // 지금까지 에러가 발생하지 않았다면, 현재 에러 상태 확인해서 업데이트
            if (isErrorOccured === false)
            {
                isErrorOccured = errorDataToUpdate.isErrorOccured;
            }
            return { 
                fileErrorStatus: errorDataToUpdate.fileErrorStatus,
                nameErrorStatus: errorDataToUpdate.nameErrorStatus 
            };
        }))
        if (isErrorOccured === true)
        {
            return;
        }
        setDrawData({ ...drawData, giftArray: giftDataArray });
    }
    useEffect(() => {
        if (drawData.giftArray.length > 0)
        {
            doDraw(false);
            moveToNextStep();
        }
    }
        ,[drawData,doDraw,moveToNextStep]        
    )

      
    return ( 
        <div className = "setting_block SettingGift">
            <p className="setting_label">추첨설정</p>
            <p className="step_label">경품 정하기</p>
            <div className = "form_wrapper">
                {
                    giftDataArray.map( (giftData,index) => {
                        return <GiftForm 
                            key={index}
                            giftDataArray = {giftDataArray}
                            setGiftData = {setGiftData}
                            nowIndex = {giftData.id}
                            errorData={errorDataArray[index]}
                        />
                    })
                }
            </div>
            <div className ="button_wrapper">
                <button className = "backward_button previous" onClick = {onClickPreviousButton}>이전</button>
                <button className = "forward_button start_draw" onClick={onClickDrawButton}>추첨하기</button>
            </div>
        </div>
    );
}

export default SettingGift