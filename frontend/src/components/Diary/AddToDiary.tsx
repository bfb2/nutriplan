import { RestaurantMenu, ExpandMore, Cancel } from "@mui/icons-material"
import { useState } from "react"
import SearchFood from "../Miscellaneous/Modal/SearchFood"
import { addEntryToDB,removeDiaryItem} from "../../functions/indexdb"
import { DBEntry, ReturnedDiaryEntry } from "../../types/types"
import Table from "../Miscellaneous/Nutrient Table/Table"
import { getCookieValue, isRecipe, isUserLoggedIn, isLinkedCustomItem, isLinkedMeal, linkRecipesAndMeals, updateReference, updateSingleReference } from "../../functions/general-use"

interface PropsTypes{
    day:Date; 
    diaryEntries: ReturnedDiaryEntry | undefined; 
    refreshDiary: (indexKey: string) => Promise<void>
}

const AddToDiary = ({day, diaryEntries, refreshDiary}:PropsTypes) =>{
    const [dropddownToggled, setDropdownToggled] = useState(true)
    const [modalActive, setModalActive] = useState(false)
    const dateKey = day.toDateString().slice(4)


    const addDiaryEntryToDB = (data:DBEntry) => {
        const linkedData = linkRecipesAndMeals(data)
        if(typeof(data.key) == 'string')
            updateReference([data.key], 'diary')
        addEntryToDB('diary', linkedData, dateKey,)
        if(isUserLoggedIn()){
            fetch('https://nutriplan-3n8c.onrender.com/save-diary-entry',{
                method:'POST',
                body:JSON.stringify({username:getCookieValue('user'), linkedData, date:dateKey}),
                headers:{"Content-Type": "application/json"},
                credentials: "include"
            })
        }
        refreshDiary(dateKey)
    }

    

 const generateDiaryItems = (diaryEntries:ReturnedDiaryEntry) => {
        
        return diaryEntries.data.map((entry, index) => {
            if(isLinkedCustomItem(entry)){
                const deleteAndDereference = () => {
                    removeDiaryItemAndUpdate(index,dateKey,refreshDiary)
                    updateSingleReference(entry.item.id, 'diary', true)
                }
                if(isRecipe(entry.item))
                    return [<RestaurantMenu style={{color:'#9da0ad'}}/>, entry.item.recipeName, entry.quantity, entry.item.servingDetails.servingName, <Cancel onClick={() => deleteAndDereference()} className="pointer"/>]
                else if(isLinkedMeal(entry.item))
                    return [<RestaurantMenu style={{color:'#9da0ad'}}/>, entry.item.mealName, entry.quantity, '',<Cancel onClick={() => deleteAndDereference()} className="pointer"/>]
                else if(entry.item !== undefined)
                    return [<RestaurantMenu style={{color:'#9da0ad'}}/>, entry.item.foodName, entry.quantity, `${entry.item.servingDetails.quantity} ${entry.item.servingDetails.measure}`, <Cancel onClick={() => deleteAndDereference()} className="pointer"/>]
            }
            else if(entry!== undefined)
                return [<RestaurantMenu style={{color:'#9da0ad'}}/>, entry.foodName, entry.quantity, entry.servingName, <Cancel onClick={() => removeDiaryItemAndUpdate(index,dateKey,refreshDiary)} className="pointer"/>]
        })
    }   

    return <>
        <section className='container container-mini'>
            <div className='add-diary-btn-cont'>
                <AddToDiaryButton title={'Log a serving to your diary'} onClick={()=>setModalActive(true)}>
                    <RestaurantMenu style={{color:'#9da0ad'}}/> &nbsp;FOOD
                </AddToDiaryButton>

                <div className={`add-to-diary-expand ${dropddownToggled && 'rotate180'}`} onClick={() => setDropdownToggled(prev => !prev)}>
                    <ExpandMore style={{color:'#005c5c'}} />
                </div>
            </div>
            { dropddownToggled && diaryEntries !== undefined && <Table addedTableClasses={{rowClass:'diary-items'}} contents={generateDiaryItems(diaryEntries) as (string | number | JSX.Element)[][]}/> }            
        </section>

        {modalActive && <SearchFood saveFoodFunc={addDiaryEntryToDB} modalName="Add Food To Diary" toggleModalFunc={setModalActive} addItemBtnText="Add To Diary"/>}
    </>
    
} 

const AddToDiaryButton = ({children, title, onClick}:DiaryProps) => {
    return <button title={title} className="add-diary-btn" onClick={onClick}>
            {children}
        </button>
}

const removeDiaryItemAndUpdate = (index:number, dateKey:string, refreshDiary:(indexKey: string) => Promise<void>) => {
    removeDiaryItem(index, dateKey).then(() => refreshDiary(dateKey)); 
    if(isUserLoggedIn()){
  
        fetch('https://nutriplan-3n8c.onrender.com/remove-diary-item',{
            method:'DELETE',
            body:JSON.stringify({username:getCookieValue('user'), index, date:dateKey}),
            headers:{"Content-Type": "application/json"},
            credentials: "include"
        })
    }
}

interface DiaryProps{
    children: (JSX.Element|string)[]
    title:string,
    onClick:()=>void
}
 export default AddToDiary