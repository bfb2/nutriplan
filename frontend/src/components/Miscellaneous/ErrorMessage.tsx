

const ErrorMessage = ({message, extraClass}:{message:string, extraClass?:string}) =>{
    return <div className={`errormsg ${extraClass}`}>{message}</div>
} 

 export default ErrorMessage