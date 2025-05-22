import { useState } from "react"
import ErrorModal from "../components/Miscellaneous/Modal/ErrorModal"
import { generateID } from "../functions/general-use"
import { hideCustomItem } from "../functions/indexdb"
import Modal from "../components/Miscellaneous/Modal/Modal"
import { CustomFood, UserDefinedItems } from "../types/types"

interface ReturnedItems{
    ItemUsedOtherPlacesModal:() => false | JSX.Element, 
    setLoopError:() => void, 
    alertItemInUse: (newItemAdded: boolean, saveItemToDb: (id?: string) => void, changeIdState: (id: string) => void, itemID: string, db: UserDefinedItems) 
        => Promise<void> | undefined
}

interface ReturnedItemsWErrorMsg extends ReturnedItems{
    CircleReferenceError: () => false | JSX.Element
}

function useCustomItemError(customItemReferences:CustomFood['referencedBy']) : ReturnedItems 
function useCustomItemError(customItemReferences:CustomFood['referencedBy'], CircleReferenceErrorMsg:string): ReturnedItemsWErrorMsg
function useCustomItemError(customItemReferences:CustomFood['referencedBy'], CircleReferenceErrorMsg?:string): ReturnedItemsWErrorMsg|ReturnedItems
{
    const [errorModal, setErrorModal] = useState({loop:false, inUse:false})
    const setLoopError = () => setErrorModal(prev => ({...prev, loop:true}))
    const [resolver, setResolver] = useState<(value: boolean) => void>()

    const CircleReferenceError = () => errorModal.loop && 
        <ErrorModal errorMsg={CircleReferenceErrorMsg || ''} closeModal={()=> setErrorModal(prev => ({...prev, loop:false}))}/>
    
    const ItemUsedOtherPlacesModal = () => errorModal.inUse &&
        <Modal smallModal={true} toggleStateFunction={()=>setErrorModal(prev => ({...prev, inUse:false}))} modalTitle="Update old entries">
            <>
                <strong className="textnowrap">This item is used in the following places</strong>
                <ul className="grid-col-all">
                    {generateLiReferences(customItemReferences)}
                </ul>
                <p className="grid-col-all margin0">Would you like to update the past entries with the changes you have made</p>
                <div className="btn-modal-placement">
                    <button onClick={()=>resolver?.(false)} className='create-btn'>NO</button>
                    <button onClick={()=>resolver?.(true)} className="grn-btn">YES</button>
                </div>
            </>
        </Modal>
    const alertItemInUse = (newItemAdded:boolean, saveItemToDb:(id?:string)=>void, changeIdState:(id:string)=>void, itemID:string, db:UserDefinedItems) => {  
        
        if(newItemAdded){
            setErrorModal(prev => ({...prev, inUse:true}))
            return new Promise(resolve => {
                setResolver(()=>resolve)
            }).then(selection => {
                if(selection == true)
                    saveItemToDb()
                else{
                    generateID().then(newID => {
                        hideCustomItem(itemID, db)
                        saveItemToDb(newID)
                        changeIdState(newID)
                })}
                 setErrorModal(prev => ({...prev, inUse:false}))   
            })
        }
            
        else
            saveItemToDb()
    }

    return {...(CircleReferenceErrorMsg && {CircleReferenceError}), ItemUsedOtherPlacesModal, setLoopError, alertItemInUse}
}

const generateLiReferences = (references:CustomFood['referencedBy']) =>{
    const items: (keyof typeof references)[] = ['diary', 'recipes', 'meals']
    return items.map(item => references[item] > 0 && <li key={item}>{`${references[item]} instances in the ${item}`}</li>)
}

export default useCustomItemError