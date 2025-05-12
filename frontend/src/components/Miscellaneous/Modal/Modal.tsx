import { Close } from "@mui/icons-material"

const Modal = ({toggleStateFunction,children,modalTitle, smallModal = false}:PropTypes) =>{

    return <div onClick={()=>toggleStateFunction(false)} className="modal-background">
        <div className={`modal ${smallModal && 'small-modal'}`} onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
                <span className="modal-title">{modalTitle}</span>
                <button className="blue-co padding0" onClick={()=>toggleStateFunction(false)}>
                    <Close/>
                </button>
            </div>
            {children}    
        </div>
    </div>
} 

interface PropTypes{
    toggleStateFunction:React.Dispatch<React.SetStateAction<boolean>>;
    children: JSX.Element;
    modalTitle:string;
    smallModal?:boolean
}

 export default Modal