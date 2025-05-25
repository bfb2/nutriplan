import { Link } from "react-router"
import Topbar from "../Miscellaneous/Topbar"


const NotFound = () =>{
    return <>
        <Topbar displayLogSign={false} passedClass="logsigntop"/>
        <main className="notfoundmain signup-container">
            <h1 className="notfoundhead">PAGE NOT FOUND</h1>
            <h2 className="notfoundcode">404</h2>
            <div className="desc">
                The page you requested can’t be
                <br/>
                found. We can still help you
                <br/>
                discover your nutrition though!
            </div>
            <button className="grn-btn mt-24">
                <Link to={'/nutriplan/dashboard'} className="linkbtn">GO TO HOMEPAGE</Link>
            </button>
            
        </main>
    </>
} 

 export default NotFound