import "./Draw.css";
import { useEffect, useState, useContext } from "react";
import { drawDataContext } from "../drawDataContext";
import Button from "./ui/Button";
const Draw = ({doDraw}) => {
    const {drawData, setDrawData} = useContext(drawDataContext);
    const [sendStatus,setSendStatus] = useState('ready');
    const nowParticipantArray = drawData.participantArray.filter(
        (participantData) => participantData.isWon === false);
    const nowGiftArray = [...drawData.giftArray];
    const sendStatusMessages = {
        'ready' : {text : '준비완료', color : 'inherit' },
        'sending' : {text : '하는 중', color : 'inherit' },
        'success' : {text : '성공', color : '#4DF472'},
        'failed' : {text : '실패', color : '#E63535'} 
    }
    const reader = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = (err) => reject(err);
      fr.readAsDataURL(file);
    });
    const onClickSendGiftButton = ()=>{
        if (drawData.mode === "no-gift") {
            setSendStatus('success');
            return;
        }        
        setSendStatus('sending');
        reader(drawData.giftArray[0].giftFile).then((file)=>{
        fetch("/sent-gifts", {
            method : "POST",
            headers: {"Content-Type" : "application/json"},
            body : JSON.stringify({
                "winnerEmail" : drawData.participantArray[drawData.nowWinnerId].email,
                "winnerName" : drawData.participantArray[drawData.nowWinnerId].name,
                "giftName" : drawData.giftArray[0].giftName,
                "giftFile" : file,
                "giftFileName" : drawData.giftArray[0].giftFile.name, 
                "sendKey" : drawData.sendKey
            })
        })
            .then((response) => {
                if (response.status === 201)
                {
                    setSendStatus('success');   
                }
                else
                {
                    setSendStatus('failed');
                }           
            })})
    }
    const onClickDrawNextButton = (mode)=>{
        if (mode === "no-gift")
        {
            setSendStatus('success');
            return;
        }
        setSendStatus('ready');
        doDraw(false,nowParticipantArray);
    }
    useEffect(()=>{
        if (sendStatus === 'success')
        {
            const nextParticipantArray= drawData.participantArray.map((participantData,index)=>{
                if (index === drawData.nowWinnerId)
                {
                    return {...participantData,isWon : true};
                }
                return participantData;
            })
            nowGiftArray.shift();
            setDrawData({...drawData,participantArray : nextParticipantArray, giftArray : nowGiftArray});
        }
    },
    [sendStatus])
    useEffect(()=>{
        if (sendStatus === 'success' && drawData.mode === "no-gift")
        {
            setSendStatus("ready");
            doDraw(false,nowParticipantArray)
        }
    },
    [drawData])
    return (
        <div className = "Draw">
            {   
                drawData.mode === "gift" ?
                <p className = "send_gift_response_label">경품 발송
                    <span style = {{fontWeight:"bold", color : sendStatusMessages[sendStatus].color}}>
                        {"  " + sendStatusMessages[sendStatus].text}
                    </span>
                </p>
                : ''
            }
            <div className = "winner_wrapper">
                <p className = "winner_name">{drawData.participantArray[drawData.nowWinnerId].name}</p>
                <p className = "win_label">당첨</p>
            </div>
            <div className = "button_wraper">
                {((sendStatus === 'success' || (sendStatus === 'ready' && nowParticipantArray.length < 2)) || drawData.mode === "no-gift" ) ? '' : <Button type={'backward_button'} onClick={() => doDraw(true,nowParticipantArray)}>다시추첨</Button> }
                {(sendStatus === 'success' || nowGiftArray.length === 0) || drawData.mode === "no-gift" ? '' : <Button type={'forward_button'} onClick={onClickSendGiftButton}>경품발송</Button>}
                {(sendStatus === 'success' && nowParticipantArray.length > 0 && nowGiftArray.length > 0) && drawData.mode === "gift" && drawData.nowRound < drawData.winnerCount - 1 ? <Button type={'forward_button'} onClick={onClickDrawNextButton}>다음 추첨</Button> : ''}
                
                {(sendStatus === 'ready' && nowParticipantArray.length < 2) || drawData.mode === "gift" ? '' : <Button type={'backward_button'} onClick={ () => doDraw(true,nowParticipantArray) }>다시 추첨</Button>}
                {sendStatus === 'ready' && nowParticipantArray.length > 1 && drawData.nowRound < drawData.winnerCount - 1 && drawData.mode==="no-gift" ? <Button type={'forward_button'} onClick={()=>{onClickDrawNextButton(drawData.mode)}}>다음 추첨</Button> : ''}
            </div>
        </div>
    );
}

export default Draw