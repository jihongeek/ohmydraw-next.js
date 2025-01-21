import './SettingMode.css';
import { drawDataContext } from '../drawDataContext';
import { useContext, useState } from 'react'; 
import Button from './ui/Button';
import TextInput from './ui/TextInput';
import ErrorMessage from './ui/ErrorMessage';
const SettingMode = ({moveToNextStep}) => {
    const {drawData,setDrawData} = useContext(drawDataContext);
    const [nowMode,setMode] = useState(drawData.mode);
    const [nowPassword,setPassword] = useState(drawData.sendKey);
    const [passwordErrorStatus,setPasswordError] = useState("none");
    const passwordErrorMessages = {
        "invalid" : "올바르지 않은 비밀번호입니다.",
        "inavailable" : "현재 비밀번호를 확인할 수 없습니다.",
        "empty" : "비밀번호를 입력해 주세요."
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
        if (nowPassword === ""){
            setPasswordError("empty");
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
                        <TextInput 
                            type={'password'} 
                            defaultValue={drawData.sendKey} 
                            onChange={onPasswordChange} 
                            hasError={passwordErrorStatus !== 'none'} 
                        />
                        <ErrorMessage
                            errorType={passwordErrorStatus}
                            errorMessages={passwordErrorMessages}  
                        />
                    </div>
                    :''
                }
            </div>
            <div className ="button_wrapper">
                <Button type={'forward_button'} onClick={onClickNextButton}>다음</Button>
            </div>
        </div>
    );
}

export default SettingMode;