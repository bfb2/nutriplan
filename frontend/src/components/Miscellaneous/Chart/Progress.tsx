import ProgressBar from "./ProgressBar"

interface PropTypes{
    label:string, 
    value:number, 
    color:string, 
    total:number, 
    secondaryLabel:string
}

const Progress = ({label, value, color, total=0, secondaryLabel}:PropTypes) =>{
    const progressNum = Math.round((value/total)*100)
    return <div className="progress-bar-container">
                <span className="progress-label">{label}</span>
                <span className='progress-chart'>
                    <div className='progress-bar-info'>
                        {parseFloat(value.toFixed(1))+secondaryLabel+' / '+ total +secondaryLabel} 
                    <div>
                        {isNaN(progressNum) || progressNum == Infinity ? 0 +'%' 
                            : progressNum +'%'}
                        </div>
                </div>
                
                <ProgressBar color={color} progress={Math.round((value/total)*100)}/>   
                </span>
            </div>
} 

 export default Progress