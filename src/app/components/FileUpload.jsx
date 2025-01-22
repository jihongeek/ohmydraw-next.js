import TextInput from "./ui/TextInput";
export default function FileUpload({fileIndex=0,fileName,hasError,onGiftFileChange, accept}) {
    return (
        <>
            <TextInput
                type= {'file_name'} 
                placeholder={fileName}
                hasError={hasError}
                disabled
            />
            <label htmlFor = {`file_${fileIndex}`}>
                <div className = "file_upload_button">파일 업로드</div>
            </label>
            <input 
                type = "file" 
                id ={`file_${fileIndex}`} 
                accept={accept}
                onChange={onGiftFileChange}
            />
        </>
    );
}