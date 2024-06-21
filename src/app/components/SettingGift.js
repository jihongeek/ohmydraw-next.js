import { useEffect, useState } from "react";
import "./SettingGift.css";
import GiftForm from "./GiftForm";

const SettingGift = ({ moveToPreviousStep,drawData,setDrawData,doDraw,moveToNextStep }) => {
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
    const onClickPreviousButton = () => {
        setDrawData({...drawData,giftArray:[]})
        moveToPreviousStep();
    }
    
    const onClickDrawButton = () => {
        let isErrorOccured = false;
        const nameValidationRegex = /^([a-zA-Zㄱ-ㅎ가-힣 0-9]{1,})$/;
        setErrorData(errorDataArray.map((errorData, index)=> {
            const errorDataToUpdate = {
                nameErrorStatus: "none",
                fileErrorStatus: "none",
            }
            if (nameValidationRegex.test(giftDataArray[index].giftName) === false)
            {
                isErrorOccured = true;
                errorDataToUpdate.nameErrorStatus = "name_wrong_character";
            }
            if (isValidImageFilename(giftDataArray[index].giftFile.name) === false)
            {
                isErrorOccured = true;
                errorDataToUpdate.fileErrorStatus = "invalid_file";
            }
            if (giftDataArray[index].giftFile.size > 1000000)
            {
                isErrorOccured = true;
                errorDataToUpdate.fileErrorStatus = "invalid_file";
            }
            if (giftDataArray[index].giftFile.size === 0 && giftDataArray[index].giftFile.name === "파일 이름")
            {
                isErrorOccured = true;
                errorDataToUpdate.fileErrorStatus = "no_file";
            }
            if (isErrorOccured === true) 
            {
                return errorDataToUpdate
            }
            return { fileErrorStatus: "none" ,nameErrorStatus: "none" }
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