import './SettingMode.css';
import { useState } from 'react'; 
const SettingMode = ({moveToNextStep,drawData,setDrawData}) => {
    const [nowMode,setMode] = useState(drawData.mode);
    const [nowPassword,setPassword] = useState(drawData.sendKey);
    const onClickNextButton = () => {
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
                    <input type="radio" id ="giftMode"value="gift" onChange={onModeChange} name="mode" defaultChecked/>
                    <label htmlFor ="no-giftMode">단순 추첨만</label>
                    <input type="radio"  id ="no-giftMode"value = "no-gift" onChange={onModeChange} name= "mode"/>
                </div>
                {
                    nowMode === "gift"?
                    <div className="participant_count_wrapper">
                        <p className="form_label participant" >비밀번호</p>
                        <input type="password" defaultValue={drawData.sendKey} onChange={onPasswordChange}/>
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