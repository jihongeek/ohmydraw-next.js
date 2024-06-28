import './SettingCount.css';
import { useContext, useState } from 'react'; 
import { drawDataContext } from '../drawDataContext';
const SettingCount = ({moveToPreviousStep,moveToNextStep}) => {
    const {drawData,setDrawData} = useContext(drawDataContext);
    const [nowParticipantCount,setParticipantCount] = useState(drawData.participantCount);
    const [nowWinnerCount,setWinnerCount] = useState(drawData.winnerCount);
    const participantErrorMessages = {
        "out_of_range" : "참가자 수는 1 ~ 10명 사이 이어야 합니다.",
    }
    const winnerErrorMessages = {
        "out_of_range" : "당첨자 수는 1명 보다 많고, 참가자 수 보다 같거나 작아야 합니다."
    }
    const [participantErrorStatus,setParticipantErrorStatus] = useState("none");
    const [winnerErrorStatus,setWinnerErrorStatus] = useState("none");
    const onClickNextButton = () => {
        // 참가자 수, 당첨자 수가 범위를 벗어날 경우
        if ( !(0 < nowParticipantCount && nowParticipantCount <= 10) )
        {
            setParticipantErrorStatus("out_of_range");
            return;
        } 
        setParticipantErrorStatus("none");
        if ( !(0 < nowWinnerCount && nowWinnerCount <= nowParticipantCount) )
        {
            setWinnerErrorStatus("out_of_range")
            return;
        }
        setWinnerErrorStatus("none");
        setDrawData({
            ...drawData,
            participantCount : nowParticipantCount,
            winnerCount : nowWinnerCount,
        });
        moveToNextStep();
    }

    const onClickPreviousButton = () => {
        setDrawData({...drawData,participantCount : 0,winnerCount:0});
        moveToPreviousStep();
    }
    const onParticipantCountChange = (e) => {
        if (isNaN(parseInt(e.target.value)))
        {
            setParticipantCount(0);
        }
        else 
        {
            setParticipantCount(parseInt(e.target.value));
        }
    }
    const onWinnerCountChange = (e) => {
        if (isNaN(parseInt(e.target.value)))
        {
            setWinnerCount(0);
        }
        else 
        {
            setWinnerCount(parseInt(e.target.value));
        }
    }
    return (
        <div className = "setting_block SettingCount">
            <p className="setting_label">추첨설정</p>
            <p className="step_label">인원 정하기</p>
            <div className="form_wrapper">
                <div className="participant_count_wrapper">
                    <p className="form_label participant" >참가인원</p>
                    <input type="number" defaultValue={nowParticipantCount} onChange={onParticipantCountChange} style={{borderColor :  participantErrorStatus !== "none"? "#E63535": ''}}></input>
                    { participantErrorStatus !== "none" && <p className="error_label name">{participantErrorMessages[participantErrorStatus]}</p> }
                </div>
                <div className="winner_count_wrapper">
                    <p className="form_label winner"  >당첨자</p>
                    <input type="number" defaultValue={nowWinnerCount} onChange={onWinnerCountChange} style={{borderColor :  winnerErrorStatus !== "none"? "#E63535": ''}}></input>
                    { winnerErrorStatus !== "none" && <p className="error_label winner">{winnerErrorMessages[winnerErrorStatus]}</p> }
                </div>
            </div>
            <div className ="button_wrapper">
                <button className = "backward_button previous" onClick = {onClickPreviousButton}>이전</button>
                <button className ="forward_button next" onClick={onClickNextButton}>다음</button>
            </div>
        </div>
    );
}

export default SettingCount;