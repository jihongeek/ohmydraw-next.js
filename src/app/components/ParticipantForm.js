import './ParticipantForm.css';
import ErrorMessage from './ui/ErrorMessage';
import TextInput from './ui/TextInput';

const ParticipantForm = ({
  formIndex,
  errors,
  setParticipants,
  participants,
  mode,
}) => {
  const errorMessages = {
    name_wrong_character:
      '이름은 특수문자를 제외한 영한문자 그리고 숫자만 가능합니다.',
    email_invalid: '올바르지 않은 이메일 형식입니다.',
  };
  const onNameInputChange = (e) => {
    setParticipants(
      participants.map((participant) => {
        return participant.id === formIndex
          ? { ...participant, name: e.target.value }
          : participant;
      })
    );
  };
  const onEmailInputChange = (e) => {
    setParticipants(
      participants.map((participant) => {
        return participant.id === formIndex
          ? { ...participant, email: e.target.value }
          : participant;
      })
    );
  };
  return (
    <div className='ParticipantForm'>
      <div className='form_start'>
        <p className='form_label name'>이름</p>
        <p className='form_indicator'>참가자 {formIndex + 1}</p>
      </div>
      <TextInput
        type='name_input'
        defaultValue={participants[formIndex].name}
        onChange={onNameInputChange}
        hasError={errors.name !== 'none'}
      />
      <ErrorMessage
        type={'name'}
        errorType={errors.name}
        errorMessages={errorMessages}
      />
      {mode === 'gift' ? (
        <>
          <p className='form_label email'>이메일</p>
          <TextInput
            type='email_input'
            defaultValue={participants[formIndex].email}
            onChange={onEmailInputChange}
            hasError={errors.email !== 'none'}
          />
          <ErrorMessage
            type={'email'}
            errorType={errors.email}
            errorMessages={errorMessages}
          />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default ParticipantForm;
