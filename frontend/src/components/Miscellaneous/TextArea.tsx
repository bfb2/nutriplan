

const TextArea = ({onInput, name, defaultValue}:{onInput: React.FormEventHandler<HTMLTextAreaElement>, name?:string, defaultValue?:string}) =>{
    return <textarea onInput={onInput} name={name} className='searchbar' defaultValue={defaultValue}/>
} 

 export default TextArea