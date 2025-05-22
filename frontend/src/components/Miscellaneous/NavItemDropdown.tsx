import { useState } from "react"
import Navitem from "./Navitem"
import { DropdownInfo } from "./Navbar";
import { Link } from "react-router"
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface NavItemDropdownProps{
    dropdownLabel: string,
    dropdownInfo: DropdownInfo[],
    navbarToggled: boolean;
    active:boolean
}
const NavItemDropdown = ({dropdownLabel, dropdownInfo, navbarToggled, active}:NavItemDropdownProps) =>{
    const [dropDownToggled, setDropdownToggled] = useState(false)
    
    return<Navitem extraClass={`${navbarToggled && 'mb-20'} ${!navbarToggled && 'dis-block'}`}>
            <div className={`nav-li-item ${navbarToggled? 'nav-li-item-edge' : 'pr0'}`} 
                 onClick={()=>setDropdownToggled(prev => !prev)}
            >
                <LocalDiningIcon className={`nav-li-item-icon-padding ${active && 'active-nav-li-item'}`}/>
                <span className={`nav-li-name ${navbarToggled && 'nav-li-name-toggled'}`}>
                        {dropdownLabel}
                </span>
                {!navbarToggled && <ExpandMoreIcon className={`expand-btn ${dropDownToggled&& 'rotate180'}`}/>} 
            </div>
                
               
            {(dropDownToggled|| navbarToggled) && 
                <ul className={`${navbarToggled && 'sublist-c'}`}>
                    {dropdownInfo.map(item => 
                        <Navitem>
                            <Link to={item.link} className={`sublist-item ${navbarToggled && 'sublist-item-c'} ${item.active && 'active-nav-li-item'}`}>{item.label}</Link>
                        </Navitem>)}    
                </ul>
            }    
        </Navitem>
        
        
} 

 export default NavItemDropdown