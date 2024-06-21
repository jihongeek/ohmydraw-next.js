import './ParticipantForm.css'
const ParticipantForm = ({nowIndex,errorData,setParticipantData,participantDataArray}) => {
    const errorMessages = {
        "name_wrong_character" : "이름은 특수문자를 제외한 영한문자 그리고 숫자만 가능합니다.", 
        "email_invalid" : "올바르지 않은 이메일 형식입니다."
    }
    const onNameInputChange = (e) => {
        setParticipantData(participantDataArray.map(
            (participantData,index) => {
                return index === nowIndex ? {...participantData, name : e.target.value} : participantData
            }
        ))
    }
    const onEmailInputChange = (e) => {
        setParticipantData(participantDataArray.map(
            (participantData,index) => {
                return index === nowIndex ? {...participantData, email : e.target.value} : participantData
            }
        ))
    }
    return (
        <div className = "ParticipantForm">
            <div className="form_start">
                <p className = "form_label name">이름</p>
                <p className="form_indicator">참가자 {nowIndex+1}</p>
            </div>
            <input 
                className = "name_input" 
                type = "text" 
                defaultValue={participantDataArray[nowIndex].name}
                onChange={onNameInputChange}
                style={ errorData.nameErrorStatus !== "none" ? {borderColor : "#E63535"} : null }
            />
            {  errorData.nameErrorStatus !== "none" && <p className = "error_label name">{errorMessages[errorData.nameErrorStatus]}</p>}
            <p className = "form_label email">이메일</p>
            <input 
                className = "email_input" 
                type = "text" 
                defaultValue={participantDataArray[nowIndex].email}
                onChange={onEmailInputChange}
                style={ errorData.emailErrorStatus !== "none" ? {borderColor : "#E63535"} : null }
            />  
            {  errorData.emailErrorStatus !== "none" && <p className = "error_label email">{errorMessages[errorData.emailErrorStatus]}</p>}
        </div>
    );
}

export default ParticipantForm;