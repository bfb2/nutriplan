import { useState, JSX } from "react"
import { Link } from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import Navitem from "./Navitem";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import NavItemDropdown from "./NavItemDropdown";
import { Settings } from "@mui/icons-material";
import { useLocation } from "react-router";

export interface DropdownInfo{
    link:string,
    label:string,
    active:boolean
}


const navbarClosed:boolean = JSON.parse(localStorage.getItem('navbar') || 'false') 
export default function Navbar(){
    const [navClosed, setNavClosed] = useState(navbarClosed)
    const location = useLocation().pathname.slice(1) 
    const [activeLink, setActiveLink] = useState({
            dashboard:false,
            diary:false,
            report:false,
            meal:false,
            food:false,
            recipe:false,
            settings:false,
            [location]:true
    })

    const trimmedLink = location.slice(10)
    if(activeLink[trimmedLink] == false){
        setActiveLink({dashboard:false,
            diary:false,
            report:false,
            meal:false,
            food:false,
            recipe:false,
            settings:false,
            [trimmedLink]:true
        })
}

    const dropdownInfo:DropdownInfo[] =[
        {link:'nutriplan/food', label:' Custom Foods', active:activeLink.food},
        {link: 'nutriplan/recipe', label:'Custom Recipes', active:activeLink.recipe},
        {link:'nutriplan/meal', label:' Custom Meals', active:activeLink.meal},
    ]
    
    return <nav className={`side-bar ${navClosed ? 'nav-trans' : 'nav-open-trans'} ${navClosed ? 'nav-closed' : 'nav-open'} menu`}>
                
                    <button className='toggle-button toggle-btn-container'>
                        <MenuIcon className={'sidebar-icon'}  onClick={()=>{setNavClosed(!navClosed); localStorage.setItem('navbar', JSON.stringify(!navClosed))}}/>
                    </button>
                
                <ul>
                    {generateNavItemContent('dashboard', navClosed, activeLink)}
                    {generateNavItemContent('diary', navClosed, activeLink)}
                    {generateNavItemContent('report', navClosed, activeLink)}
                    <NavItemDropdown dropdownLabel="Foods" dropdownInfo={dropdownInfo} navbarToggled={navClosed} active={activeLink.recipe || activeLink.food || activeLink.meal}/>
                    {generateNavItemContent('settings', navClosed, activeLink)}
                </ul>        
            </nav>
}

interface ActiveLinkTypes{
    dashboard: boolean;
    diary: boolean;
    report: boolean;
    meal: boolean;
    food: boolean;
    recipe: boolean;
    settings: boolean;
}



function generateNavItemContent(link: keyof ActiveLinkTypes, navClosed: boolean, activeLink: ActiveLinkTypes): JSX.Element{
    
    const getLinkIcon = () => {
        switch (link) {
        case 'dashboard':
            return <DashboardIcon className="nav-li-item-icon-padding"/>
        case 'diary':
            return <MenuBookIcon className="nav-li-item-icon-padding"/> 
        case 'report':
            return <InsertChartIcon className="nav-li-item-icon-padding"/>
        case 'settings':
            return <Settings className="nav-li-item-icon-padding"/>
        default:
            break;
    }
    }

    return <Navitem extraClass={`${navClosed && 'mb-20'}`}>
             <Link className={`${activeLink[link]  && 'active-nav-li-item'} nav-li-item`} 
                   to={`nutriplan/${link}`}
             > 
                {getLinkIcon()}
                <span className={`nav-li-name ${navClosed && 'nav-li-name-toggled'}`}>
                    {link[0].toUpperCase()+link.slice(1)}
                </span>
            </Link>
           </Navitem>
}