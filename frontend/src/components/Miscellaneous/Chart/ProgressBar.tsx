

const ProgressBar = ({color, progress}:{color:string, progress:number}) =>{
    

    return <div className='progress-bar' > 
        <span style={{background:color, width:progress+'%'}}/>
    </div>
} 

 export default ProgressBar