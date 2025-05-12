import {ReactNode } from "react"

const Navitem = ({children, extraClass}: {children: ReactNode, extraClass?:string}) =>{
    return <li className={`nav-li-item-container ${extraClass}`}>
        {children}
    </li>
}

export default Navitem