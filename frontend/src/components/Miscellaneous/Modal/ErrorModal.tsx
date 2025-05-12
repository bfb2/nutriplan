import Modal from "./Modal"

const ErrorModal = ({errorMsg, closeModal, title}:{errorMsg:string, title?:string, closeModal:React.Dispatch<React.SetStateAction<boolean>>}) =>{
    
    return <Modal modalTitle={title || "Error"} toggleStateFunction={closeModal} smallModal={true}>
        <>
            <p className="sm-error-msg">{errorMsg}</p>
            <button onClick={()=>closeModal(false)} className="sm-close grn-btn sm-btn-pos">OK</button>
        </>
    </Modal>
    
} 

 export default ErrorModal