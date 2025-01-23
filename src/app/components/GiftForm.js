import './GiftForm.css';
import ErrorMessage from './ui/ErrorMessage';
import FileUpload from './FileUpload';
import TextInput from './ui/TextInput';

const GiftForm = ({ gifts, errors, setGifts, formIndex }) => {
  const errorMessages = {
    name_wrong_character:
      '경품명은 특수문자를 제외한 영한문자 그리고 숫자만 가능합니다.',
    no_file: '파일을 업로드 해주세요',
    invalid_file: '1mb 이하의 jpg, png 파일만 업로드 가능합니다.',
  };
  const onGiftFileChange = (e) => {
    setGifts(
      gifts.map((gift, index) => {
        if (index === formIndex && e.target.files.length > 0)
          return { ...gift, giftFile: e.target.files[0] };
        return gift;
      })
    );
  };
  const onGiftNameChange = (e) => {
    setGifts(
      gifts.map((gift, index) => {
        if (index === formIndex) return { ...gift, giftName: e.target.value };
        return gift;
      })
    );
  };
  return (
    <div className='GiftForm'>
      <div className='form_start'>
        <p className='form_label gift_name'>경품 이름</p>
        <p className='form_indicator'>경품 {formIndex + 1}</p>
      </div>
      <TextInput
        type={'gift_name'}
        defaultValue={gifts[formIndex].giftName}
        onChange={onGiftNameChange}
        hasError={errors.name !== 'none'}
      />
      <ErrorMessage
        type={'gift_name'}
        errorType={errors.name}
        errorMessages={errorMessages}
      />
      <p className='form_label gift_file'>경품 파일</p>
      <FileUpload
        fileIndex={formIndex}
        fileName={gifts[formIndex].giftFile.name}
        hasError={errors.file !== 'none'}
        onGiftFileChange={onGiftFileChange}
        accept={'image/png, image/jpeg'}
      />

      <ErrorMessage
        type={'gift_file'}
        errorType={errors.file}
        errorMessages={errorMessages}
      />
    </div>
  );
};

export default GiftForm;
