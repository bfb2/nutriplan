import { AddCircle, ArrowBack } from "@mui/icons-material"
import { useState, useEffect} from "react";
import NutritionOverview from "./Nutrient Table/NutritionOverview";
import { Meals, UserDefinedItems, SavedRecipe, TrackedNutrients, CustomFood } from "../../types/types";
import TotalNutrientsTables from "./Nutrient Table/TotalNutrientsTables";
import SavedItems from "./SavedItems";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { deleteUserDefinedItem, retrieveUserDefinedItems } from "../../functions/indexdb";

const CustomItemsLanding = ({heading, headingSubtext, enterEditModeText, children, exitEditModeText, db, loadCustomItemInfoFunc, displaySave, 
                            savedName, onSave, resetState, interactiveNutrientTable, nutritionData, updateNutritionData, savedItemsSearchBarPlaceholder, 
                            savedItemsEmptyMsg, itemID}:PropTypes) =>{
    const [editMode, setEditMode] = useState(false)

    const [displayDropdown, setDisplayDropdown] = useState(false)
    useEffect(()=>{
        switch (db) {
            case "recipe":
                retrieveUserDefinedItems(db, itemID).then(item => item == undefined ? setDisplayDropdown(false):setDisplayDropdown(true))
                break;
            case 'food':
                retrieveUserDefinedItems(db, itemID).then(item => item == undefined ? setDisplayDropdown(false):setDisplayDropdown(true))
                break
            case 'meal':
                retrieveUserDefinedItems(db, itemID).then(item => item == undefined ? setDisplayDropdown(false):setDisplayDropdown(true))
                break
            default:
                break;
        }
    }, [itemID, db])
    
    const {protein:{protein}, carbohydrates:{carbohydrates:carbs},general:{energy:calories}, fat:{fat} } = nutritionData

    const getItemInfo = (data:SavedRecipe|Meals|CustomFood) =>{
        loadCustomItemInfoFunc(data);
        setEditMode(true)
    } 
    return <main className="outlet">
        <h1 className="heading heading-margin">{heading}</h1>
        <p className="heading-margin">{headingSubtext}</p>

            {!editMode ? <div className="container">
                <button onClick={()=>{setEditMode(true); resetState()}} className="create-btn">
                    <AddCircle/>&nbsp;{enterEditModeText}
                </button>
                <SavedItems db={db} searchBarPlaceholder={savedItemsSearchBarPlaceholder} getItemsInfo={getItemInfo} ifEmptyMessage={savedItemsEmptyMsg}/>
            </div>

            :

            <>
                <button onClick={()=>setEditMode(false)} className="create-btn">
                        <ArrowBack/> &nbsp;{exitEditModeText}
                </button>
                <form className="container" onSubmit={e=> {e.preventDefault(); onSave(e)}}>
                    <div className="custom-items-info-heading">
                        <span className="cus-item-name">{savedName}</span>
                        <span className="custom-item-btns">
                            { displaySave && <button type="submit" className="clear-btn">SAVE CHANGES</button>}
                            {displayDropdown && <Dropdown db={db} id={itemID} setEditMode={setEditMode}/>}
                        </span>
                        
                    </div>
                    <hr/>
                    {children} 
                </form>
                
                <NutritionOverview nutrition={{protein, calories, carbs, fat}}/>
                <TotalNutrientsTables totalNutrients={nutritionData} interactive={interactiveNutrientTable} updateNutrients={updateNutritionData}/>
            </>
        
            }
    </main>
}

const Dropdown = ({db, id, setEditMode}:{db:UserDefinedItems, id:string, setEditMode:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [dropdownActive, setDropdownActive] = useState(false)
    const options = ['Delete']
    return <div className="relative">
        <div onClick={()=>setDropdownActive(prev => !prev)}><MoreHorizIcon className="option circle-radius pointer"/></div>
        {dropdownActive && <ul className="popup">
            {options.map(option => <li onClick={()=>{deleteUserDefinedItem(db, id); fetch('https://nutriplan-3n8c.onrender.com/delete-custom-item',{
                        method:'DELETE',
                        body:JSON.stringify({id, db}),
                        headers:{"Content-Type": "application/json"},
                        credentials: "include"
                    }); setEditMode(false)}} className="popup-items option">{option}</li>)}
        </ul>
        }
    </div>
}

interface PropTypes{
    heading:string;
    headingSubtext:string;
    enterEditModeText:string;
    children:JSX.Element;
    exitEditModeText:string;
    db: UserDefinedItems;
    loadCustomItemInfoFunc(data: SavedRecipe|Meals|CustomFood): void;
    displaySave: boolean;
    savedName:string;
    onSave: (e: React.FormEvent<HTMLFormElement>)=>void;
    resetState: () => void;
    interactiveNutrientTable: boolean;
    nutritionData:TrackedNutrients;
    updateNutritionData?: (nutrientGroup: keyof TrackedNutrients, value: string, nutrient: keyof typeof nutrientGroup) => void;
    savedItemsSearchBarPlaceholder:string;
    savedItemsEmptyMsg:string,
    divisor?:number
    itemID:string
}

 export default CustomItemsLanding