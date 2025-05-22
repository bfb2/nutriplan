
import { isUserLoggedIn, clearPreferences} from "../../functions/general-use"
import { Link } from "react-router"
import { clearPersonalData } from "../../functions/indexdb"

const Topbar = ({passedClass, displayLogSign = true}:{passedClass?:string, displayLogSign?:boolean}) =>{

    const logOut = () =>{
        fetch('https://nutriplan-fngd.onrender.com/logout',{credentials:'include', method:'POST'}).then(() =>{
                clearPersonalData()
                clearPreferences()
        })
    }

    return <header className={`top-bar ${passedClass}`}>
        {displayLogSign && (!isUserLoggedIn()  ? <>
            <Link to={'signup'}>Sign up</Link>&nbsp; / &nbsp; <Link to={'login'}>Log in</Link>
        </>
        :<Link onClick={logOut} to={'login'}>Log out</Link>)} 
    </header>
} 

 export default Topbar