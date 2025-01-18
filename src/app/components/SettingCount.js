import './SettingCount.css';
import { useContext, useState } from 'react'; 
import { drawDataContext } from '../drawDataContext';
import Button from './ui/Button';
const SettingCount = ({moveToPreviousStep,moveToNextStep}) => {
    const {drawData,setDrawData} = useContext(drawDataContext);
    const [nowParticipantCount,setParticipantCount] = useState(drawData.participantCount);
    const [nowWinnerCount,setWinnerCount] = useState(drawData.winnerCount);
    const participantErrorMessages = {
        "out_of_range" : "참가자 수는 1 ~ 50명 사이 이어야 합니다.",
    }
    const winnerErrorMessages = {
        "out_of_range" : "당첨자 수는 1명 보다 많고, 참가자 수 보다 같거나 작아야 합니다."
    }
    const [participantErrorStatus,setParticipantErrorStatus] = useState("none");
    const [winnerErrorStatus,setWinnerErrorStatus] = useState("none");
    const onClickNextButton = () => {
        // 참가자 수, 당첨자 수가 범위를 벗어날 경우
        if ( !(0 < nowParticipantCount && nowParticipantCount <= 50) )
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
    const onListFileUpload = async (e) => {
        const participantArray = []
        const csv = await e.target.files[0].text();
        const csvLines = csv.split('\r\n');
        const csvHeader = csvLines[0].split(',');
        const columnIndex = {
          'Email' : 0,
          'Last Name' : 0,
          'First Name' : 0
        }
        for (let i = 0; i < csvHeader.length; i++) {
          if (csvHeader[i] === 'Email') {
            columnIndex['Email'] = i;
          }
          if (csvHeader[i] === 'Last Name') {
            columnIndex['Last Name'] = i;
          }
          if (csvHeader[i] === 'First Name') {
            columnIndex['First Name'] = i;
          }
        }
        for (let i = 1; i < csvLines.length; i++) {
            if (csvLines[i] === '') continue;
            const csvLine = csvLines[i].split(',');
            participantArray.push({
                id : participantArray.length,
                email : csvLine[columnIndex['Email']], 
                name: `${csvLine[columnIndex['Last Name']]} ${csvLine[columnIndex['First Name']]}`,
                isWon : false
            });
        }
        setDrawData({...drawData, participantArray : participantArray});
        setParticipantCount(participantArray.length);
    }
    return (
        <div className = "setting_block SettingCount">
            <p className="setting_label">추첨설정</p>
            <p className="step_label">인원 정하기</p>
            <div className="form_wrapper">
                <div className="participant_count_wrapper">
                    <p className="form_label participant" >참가인원</p>
                    <input type="number" value={nowParticipantCount} onChange={onParticipantCountChange} style={{borderColor :  participantErrorStatus !== "none"? "#E63535": ''}}></input>
                    { participantErrorStatus !== "none" && <p className="error_label name">{participantErrorMessages[participantErrorStatus]}</p> }
                    <p className="form_label"> 참가 인원 리스트</p>
                    <label htmlFor = {`file_participant_list`}>
                        <div className = "file_upload_button">파일 업로드</div>
                    </label>
                    <input 
                        type = "file" 
                        id ={`file_participant_list`} 
                        accept="text/csv"
                        onChange={onListFileUpload}
                    />
                </div>

                <div className="winner_count_wrapper">
                    <p className="form_label winner"  >당첨자</p>
                    <input type="number" defaultValue={nowWinnerCount} onChange={onWinnerCountChange} style={{borderColor :  winnerErrorStatus !== "none"? "#E63535": ''}}></input>
                    { winnerErrorStatus !== "none" && <p className="error_label winner">{winnerErrorMessages[winnerErrorStatus]}</p> }
                </div>
            </div>
            <div className ="button_wrapper">
                <Button type={'backward_button'} onClick={onClickPreviousButton}>이전</Button>
                <Button type={'forward_button'} onClick={onClickNextButton}>다음</Button>
            </div>
        </div>
    );
}

export default SettingCount;