

const Label = ({children, labelName, passedClass, labelClass, itemClass}:PropTypes) =>{
    return <div className={`${passedClass} flex gap25`}>
        <div className='label row'>
            <span className={`label ${labelClass}`}>{labelName}</span>
        </div>
        <div className={`row ${itemClass}`}>{children}</div>
    </div>
} 

interface PropTypes{
    children:JSX.Element;
    labelName:string;
    passedClass?:string;
    labelClass?:string;
    itemClass?:string
}
 export default Label