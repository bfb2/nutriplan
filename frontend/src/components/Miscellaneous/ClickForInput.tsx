import { useState } from "react"
import Input from "./Input"

const ClickForInput = ({value, onBlur,name }: PropTypes) =>{
    const [editMode, setEditMode] = useState(false)    
    return <>
        {
            editMode ? <Input name={name} onBlur={(evt)=> {onBlur(evt); setEditMode(false);} } autoFocus={true} defaultValue={value} extraClass="serving-click-input"/>   
            : <div onClick={()=>{ setEditMode(true)}}>{value}</div>
        }
    </>
} 

interface PropTypes{
    value: string|number;
    onBlur : React.FocusEventHandler<HTMLInputElement>;
    name:string;
    
}

 export default ClickForInput