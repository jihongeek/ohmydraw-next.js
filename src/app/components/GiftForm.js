import './GiftForm.css'
import ErrorMessage from './ui/ErrorMessage'
import FileUpload from './FileUpload'
import TextInput from './ui/TextInput'
const GiftForm = ({giftDataArray,errorData,setGiftData,nowIndex}) => {
    const errorMessages = {
        "name_wrong_character" : "경품명은 특수문자를 제외한 영한문자 그리고 숫자만 가능합니다.", 
        "no_file" : "파일을 업로드 해주세요",
        "invalid_file" : "1mb 이하의 jpg, png 파일만 업로드 가능합니다."
    }
    const onGiftFileChange = (e) => {
        setGiftData(giftDataArray.map((giftData,index)=>{
            if (index === nowIndex && e.target.files.length > 0)
                return {...giftData, giftFile : e.target.files[0]}
            return giftData
        }))
    }
    const onGiftNameChange = (e) => {
        setGiftData(giftDataArray.map( (giftData,index) => {
            if (index === nowIndex)
                return {...giftData, giftName : e.target.value}
            return giftData 
        }))
    }
    return (
        <div className = "GiftForm">
            <div className="form_start">
                <p className = "form_label gift_name">경품 이름</p>
                <p className = "form_indicator">경품 {nowIndex+1}</p>
            </div>
            <TextInput 
                type = {'gift_name'} 
                defaultValue={giftDataArray[nowIndex].giftName}
                onChange={onGiftNameChange}      
                hasError={errorData.nameErrorStatus !== "none"}
            />
            <ErrorMessage
                type={'gift_name'}
                errorType={errorData.nameErrorStatus}
                errorMessages={errorMessages}
            />
            <p className = "form_label gift_file" >경품 파일</p>
            <FileUpload 
                fileIndex={nowIndex}
                fileName={giftDataArray[nowIndex].giftFile.name}
                hasError={errorData.fileErrorStatus !== 'none'}
                onGiftFileChange={onGiftFileChange}
                accept={'image/png, image/jpeg'}
            />

            <ErrorMessage
                type={'gift_file'}
                errorType={errorData.fileErrorStatus}
                errorMessages={errorMessages}
            />
        </div>
    );
}

export default GiftForm 