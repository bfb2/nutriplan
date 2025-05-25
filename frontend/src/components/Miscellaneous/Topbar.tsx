
import { isUserLoggedIn, clearPreferences} from "../../functions/general-use"
import { Link } from "react-router"
import { clearPersonalData } from "../../functions/indexdb"

const Topbar = ({passedClass, displayLogSign = true}:{passedClass?:string, displayLogSign?:boolean}) =>{

    const logOut = () =>{
        fetch('https://nutriplan-fngd.onrender.com/logout',{credentials:'include', method:'POST'}).then(() =>{
                clearPersonalData()
                clearPreferences()
                document.cookie = `loggedInToken=true; max-age=0; path=/`

        })
    }

    return <header className={`top-bar ${passedClass}`}>
        {displayLogSign && (!isUserLoggedIn()  ? <>
            <Link to={'nutriplan/signup'}>Sign up</Link>&nbsp; / &nbsp; <Link to={'nutriplan/login'}>Log in</Link>
        </>
        :<Link onClick={logOut} to={'nutriplan/login'}>Log out</Link>)} 
    </header>
} 

 export default Topbar