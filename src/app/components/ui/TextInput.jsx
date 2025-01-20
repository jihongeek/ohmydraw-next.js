export default function TextInput({defaultValue,value,type,placeholder, disabled, onChange, hasError}) {
    const inputType = {
        'name_input' : 'text',
        'email_input' : 'email',
        'gift_name' : 'text',
        'file_name' : 'text',
        'password' : 'password',
        'number' : 'number'
    }
    
    return (
        <input 
            className={type} 
            type={inputType[type]} 
            defaultValue={defaultValue}
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            style={hasError ? {borderColor : '#E36535'} : null}
            disabled={disabled}
        />
    );
} 