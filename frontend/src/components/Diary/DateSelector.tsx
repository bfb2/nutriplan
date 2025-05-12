import { NavigateBefore, NavigateNext } from "@mui/icons-material"
import React from "react"

const DateSelector = ({day, setDay}:{day:Date, setDay:React.Dispatch<React.SetStateAction<Date>>}) =>{
    
    const updateDay = (dayChange:number) =>{
        const newDay = new Date(day.setDate(day.getDate()+dayChange))
        setDay(newDay)
    }
    
    return <div className="container container-mini" style={{width:'fit-content'}}>
        <div className='date-container'>
            <button className="add-diary-btn" onClick={()=>updateDay(-1)}>
                <NavigateBefore/>
            </button>
            <div className='diary-date'>{day.toDateString().slice(4,10)}</div>
            <button className="add-diary-btn" style={{marginLeft:'15px'}} 
                    onClick={()=>updateDay(1)}
            >
                <NavigateNext/>
            </button>
        </div>
    </div>
} 


 export default DateSelector