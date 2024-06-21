import './GiftForm.css'
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
            <input 
                className = "gift_name" 
                type = "text" 
                defaultValue={giftDataArray[nowIndex].giftName}
                onChange={onGiftNameChange}      
                style={ errorData.nameErrorStatus !== "none" ? {borderColor : "#E63535"} : null }
            />
            {  errorData.nameErrorStatus !== "none" && <p className = "error_label gift_name">{errorMessages[errorData.nameErrorStatus]}</p>}
            <p className = "form_label gift_name" style = {{display : "none"}}></p>
            <p className = "form_label gift_file" >경품 파일</p>
            <input 
                className= "file_name" 
                type = "text" 
                placeholder={giftDataArray[nowIndex].giftFile.name}
                style={ errorData.fileErrorStatus !== "none" ? {borderColor : "#E63535"} : null }
                disabled
            />
            <label htmlFor = {`file_${nowIndex}`}>
                <div className = "file_upload_button">파일 업로드</div>
            </label>
            <input 
                type = "file" 
                id ={`file_${nowIndex}`} 
                accept="image/png, image/jpeg"
                onChange={onGiftFileChange}
            />
            {  errorData.fileErrorStatus !== "none" && <p className = "error_label gift_file">{errorMessages[errorData.fileErrorStatus]}</p>}
        </div>
    );
}

export default GiftForm 