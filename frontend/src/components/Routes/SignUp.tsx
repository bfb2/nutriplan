import Label from "../Miscellaneous/Label"
import Input from "../Miscellaneous/Input"
import Topbar from "../Miscellaneous/Topbar"
import { useState } from "react"
import ErrorMessage from "../Miscellaneous/ErrorMessage"
import { useNavigate } from "react-router"
 
const SignUp = () =>{
    const [errorMsg, setErrorMsg] = useState<{msg:string, errorField:string|undefined}>({msg:'', errorField:undefined})
    const navigate = useNavigate()   
    const submitSignUpData = (event:React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const formInputs = {name:'a username', password:'a password', confirmedPassword:'your confirm password'};
        const isWhitespaceString = (str:string) => !str.replace(/\s/g, '').length

        const formData = new FormData(event.target as HTMLFormElement)
        const formObject = Object.fromEntries(formData.entries())
        
         for(const property in formObject ){
             if(isWhitespaceString(property))
                return setErrorMsg({msg:`Please enter ${formInputs[property as keyof typeof formInputs]}`, errorField:property}) 
        }
        const {name, password, confirmedPassword} = formObject as {name:string, password:string, confirmedPassword:string} 
        if(password !== confirmedPassword)
            return setErrorMsg({msg:'Make sure passwords entered are the same', errorField:'confirmedPassword'})

        const errorCodesMsgs = {
            11000:{msg:'Username taken, try a different username', field:'name'},
            generic:{msg:'Error, please try again', field:undefined}
        }
        fetch('https://nutriplan-fngd.onrender.com/signup',{
            method:'POST',
            body:JSON.stringify({username:name, password}),
            headers:{"Content-Type": "application/json"}
        }).then(res => res.json() as Promise<({success:true} | {success:false, errorCode:keyof typeof errorCodesMsgs})>)
          .then(data => {
            if(data.success==true){
                navigate('/nutriplan/dashboard')
            }
            else{
                setErrorMsg({msg:errorCodesMsgs[data.errorCode].msg, errorField:errorCodesMsgs[data.errorCode].field}) 
            }
        })

    }

    function removeErrorMsg(e:React.FocusEvent<HTMLInputElement>) {
        if(errorMsg.errorField == undefined)
            return
        
        if(e.target.name ==errorMsg.errorField)
            setErrorMsg({msg:'', errorField:undefined})
    }
    return <>
        <Topbar displayLogSign={false} passedClass="logsigntop"/>
        <main className="signup-container">
            <h1 className="page-title">Create Your Free Account</h1>
            {errorMsg.msg !== '' && <ErrorMessage message={errorMsg.msg}/>}
            <form className="container signlogcon" onSubmit={submitSignUpData}>
                <Label labelName="Username" passedClass="col">
                    <Input name="name" placeholder={'Username'} onFocus={removeErrorMsg} autocomplete="username"/>
                </Label>

                <Label labelName="Password" passedClass="mt-10 col">
                    <Input name="password" placeholder={'Password'} onFocus={removeErrorMsg} type="password" autocomplete="current-password"/>
                </Label>

                <Label labelName="Confirm Password" passedClass="mt-10 col input-label">
                    <Input name="confirmedPassword" placeholder={'Confirm Password'} onFocus={removeErrorMsg} type="password" autocomplete="current-password"/>
                </Label>
                <button className="modal-submit-pos grn-btn signupbtn">SIGN UP</button>
            </form>
        </main>
    </>
} 

 export default SignUp