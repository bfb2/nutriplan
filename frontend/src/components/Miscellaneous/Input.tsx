

const Input = ({onInput, placeholder, extraClass, defaultValue, onBlur, autoFocus = false, name, onFocus, type='text', value, onChange, autocomplete}:PropTypes) =>{
    return <input onKeyUp={onInput} name={name} autoFocus={autoFocus} onBlur={onBlur} key={defaultValue} onChange={onChange}
        type={type} defaultValue={defaultValue} placeholder={placeholder} className={`searchbar ${extraClass}`} autoComplete={autocomplete}
        onFocus={onFocus} value={value}
        />
} 

interface PropTypes{
    onInput?:React.KeyboardEventHandler<HTMLInputElement>;
    placeholder?:string;
    extraClass?:string;
    defaultValue?: string|number;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    autoFocus?: boolean;
    name?:string;
    onFocus?:React.FocusEventHandler<HTMLInputElement>;
    type?:React.HTMLInputTypeAttribute;
    value?:string|number;
    onChange?:React.ChangeEventHandler<HTMLInputElement>;
    autocomplete?:React.HTMLInputAutoCompleteAttribute
}
 export default Input