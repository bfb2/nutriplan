import { useNavigate } from "react-router"
import { useEffect } from "react"

const NutriplanRoot = () =>{
    const navigate = useNavigate()
    useEffect(()=>{
        navigate('/nutriplan/dashboard', {replace:true})
    },[])
    return <div></div>
} 

 export default NutriplanRoot