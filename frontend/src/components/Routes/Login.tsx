import Input from "../Miscellaneous/Input"
import Label from "../Miscellaneous/Label"
import Topbar from "../Miscellaneous/Topbar"
import { Link } from "react-router"
import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import ErrorMessage from "../Miscellaneous/ErrorMessage"
import { importDiaryFromDB, importSavedItemsFromDB } from "../../functions/indexdb"
import { CustomFood, Meals, SavedRecipe, Nutrients, DiaryEntry } from "../../types/types"
import { accessDisplayedDashboardNutrients, accessNutrientGoals, isUserLoggedIn } from "../../functions/general-use"


const Login = () =>{
    const navigate = useNavigate()
    useEffect(()=>{
        if(isUserLoggedIn()){
            navigate('/dashboard')  
        }
           
        else
            setLoadPermission(true)
    },[])
    const errorCodesMsgs = ["Username doesn't exist", "Password doesn't match"]
    const [errorMsg, setErrorMsg] = useState<string>()
    const [loadPermission, setLoadPermission] = useState(false)

    const attemptLogin = (event:React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const formObject = Object.fromEntries(formData.entries())
        const {username ,password} = formObject as {username: string, password:string}
        
        fetch('https://nutriplan-fngd.onrender.com/login',{
            method:'POST',
            body:JSON.stringify({username, password}),
            headers:{"Content-Type": "application/json"},
            credentials: "include"
        }).then(res => res.json())
          .then(data => {
            if(data.success == true){
                const {recipe, meal, food, nutrientRDA, dashboardDisplay, diary} = data as {recipe:Record<string, SavedRecipe>, meal:Record<string, Meals>, food:Record<string, CustomFood>, nutrientRDA:Record<Nutrients, number>, dashboardDisplay:Record<Nutrients, boolean>, diary:Record<string, DiaryEntry>}
                document.cookie = `loggedInToken=true; max-age=4320000; path=/`
                const recipes = Object.values(recipe)
                const meals = Object.values(meal)
                const foods = Object.values(food)
                importSavedItemsFromDB('recipe', recipes)
                importSavedItemsFromDB('food', foods)
                importSavedItemsFromDB('meal', meals)
                importDiaryFromDB(diary)

                const rdaKeys = Object.keys(nutrientRDA) as Nutrients[]
                if(rdaKeys.length > 0){
                    const localRDAs = accessNutrientGoals()
                    rdaKeys.forEach(key => localRDAs[key] = nutrientRDA[key])
                    localStorage.setItem('nutrient targets', JSON.stringify(localRDAs))  
                }
                
                const dashboardNutrientKeys = Object.keys(dashboardDisplay) as Nutrients[]
                if(dashboardNutrientKeys.length > 0){
                    const nutrientsOnDashboard = accessDisplayedDashboardNutrients()  
                    dashboardNutrientKeys.forEach(key => nutrientsOnDashboard[key] = dashboardDisplay[key])
                    localStorage.setItem('dashboard nutrients', JSON.stringify(nutrientsOnDashboard))
                }                
                navigate('/dashboard')
            }
            else
                setErrorMsg(errorCodesMsgs[data.errorCode])
          })
    }
    if(loadPermission) 
    return <>
        <Topbar displayLogSign={false} passedClass="logsigntop"/>
        <main className="signup-container">
            {errorMsg && <ErrorMessage message={errorMsg}/>}
            <form className="container mini-container-padding" onSubmit={attemptLogin}>
                <h1 className="container-text">Welcome Back</h1>
                <Label labelName="Username">
                    <Input placeholder={'Username'} name="username" extraClass="width100"/>
                </Label>
                <Label labelName="Password" passedClass="mt-10">
                    <Input placeholder={'Password'} name="password" extraClass="width100" type="password"/>
                </Label>

                <button className="modal-submit-pos grn-btn signupbtn">Login</button>
            </form>
            <div className='mt-20'>
                <span>Not a member?</span>
                <br/>
                <Link to={'/signup'} className='login'>Sign Up</Link>
            </div>
        </main>
    </>
} 


 export default Login