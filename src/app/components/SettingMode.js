import './SettingMode.css';
import { useState } from 'react'; 
const SettingMode = ({moveToNextStep,drawData,setDrawData}) => {
    const [nowMode,setMode] = useState(drawData.mode);
    const [nowPassword,setPassword] = useState(drawData.sendKey);
    const [passwordErrorStatus,setPasswordError] = useState("none");
    const passwordErrorMessages = {
        "invalid" : "올바르지 않은 비밀번호 입니다.",
        "inavailable" : "현재 비밀번호를 확인할 수 없습니다."
    };
    const onClickNextButton = async () => {
        if (nowMode === "no-gift"){
            setDrawData({
                ...drawData,
                mode : nowMode,
            });
            moveToNextStep();
            return;
        }
        const response = await fetch("/sendkey/validate",{
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                "sendKey" : nowPassword
            })
        });
        if (response.status != 200){
            setPasswordError("inavailable");
            return;
        } 
        const responseJson = await response.json();

        if (!responseJson['isValid']){
            setPasswordError("invalid");
            return;
        }
        setDrawData({
            ...drawData,
            mode : nowMode,
            sendKey : nowPassword
        });
        moveToNextStep();
    }
    const onModeChange = (e) => {
        setMode(e.target.value);
    }
    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }
    
    return (
        <div className = "setting_block SettingMode">
            <p className="setting_label">추첨설정</p>
            <p className="step_label">경품 모드 정하기</p>
            <div className="form_wrapper">
                <div className="participant_count_wrapper">
                    <p className="form_label participant" >경품 모드</p>
                    
                    <label htmlFor ="giftMode">경품 직접 전송</label>
                    {
                        nowMode === "gift" ?
                        <input type="radio" id ="giftMode"value="gift" onChange={onModeChange} name="mode" defaultChecked/>
                        : <input type="radio" id ="giftMode"value="gift" onChange={onModeChange} name="mode"/>
                    }
                    <label htmlFor ="no-giftMode">단순 추첨만</label>
                    {
                        nowMode === "no-gift" ?
                        <input type="radio"  id ="no-giftMode"value = "no-gift" onChange={onModeChange} name= "mode" defaultChecked/>
                        : <input type="radio"  id ="no-giftMode"value = "no-gift" onChange={onModeChange} name= "mode"/>
                    }
                </div>
                {
                    nowMode === "gift"?
                    <div className="participant_count_wrapper">
                        <p className="form_label participant" >비밀번호</p>
                        <input type="password" defaultValue={drawData.sendKey} onChange={onPasswordChange} style={{borderColor :  passwordErrorStatus !== "none"? "#E63535": ''}}/>
                        { passwordErrorStatus !== "none" && <p className="error_label">{passwordErrorMessages[passwordErrorStatus]}</p> }
                    </div>
                    :''
                }
            </div>
            <div className ="button_wrapper">
                <button className ="forward_button next" onClick={onClickNextButton}>다음</button>
            </div>
        </div>
    );
}

export default SettingMode;