

const TextArea = ({onInput, name, defaultValue}:{onInput: React.KeyboardEventHandler<HTMLInputElement>, name?:string, defaultValue?:string}) =>{
    return <textarea onInput={onInput} name={name} className='searchbar' defaultValue={defaultValue}/>
} 

 export default TextArea