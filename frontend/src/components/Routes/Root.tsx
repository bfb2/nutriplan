import Navbar from "../Miscellaneous/Navbar"
import { Outlet } from "react-router"
import Topbar from '../Miscellaneous/Topbar'
import ErrorMessage from "../Miscellaneous/ErrorMessage"
import { useEffect, useState } from "react"
import { isUserLoggedIn } from "../../functions/general-use"

export default function Root(){
   /*  const navigate = useNavigate()
    const location = useLocation().pathname */


    
    /* useEffect(()=>{
        if(location == '/' || location == '')
            navigate('/dashboard')
    },[location]) */

    useEffect(()=>{
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    },[])

    const [isOnline, setIsOnline] = useState(navigator.onLine)
    
    return <div className="app-container" >
        <Topbar/>
        <Navbar/>
        {(isUserLoggedIn() && !isOnline) && <ErrorMessage extraClass="js-center" message="Not connected to the internet"/>}
        <Outlet/>
    </div>
}