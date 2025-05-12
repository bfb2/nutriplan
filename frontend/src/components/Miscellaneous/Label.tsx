

const Label = ({children, labelName, passedClass, labelClass}:PropTypes) =>{
    return <div className={`${passedClass} flex gap25`}>
        <div className='label row'>
            <span className={`label ${labelClass}`}>{labelName}</span>
        </div>
        <div className='row'>{children}</div>
    </div>
} 

interface PropTypes{
    children:JSX.Element;
    labelName:string;
    passedClass?:string;
    labelClass?:string
}
 export default Label