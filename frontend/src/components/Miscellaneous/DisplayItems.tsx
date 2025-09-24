import { isLinkedCustomItem, isLinkedMeal, isRecipe, updateSingleReference } from "../../functions/general-use"
import { DBEntry, LinkedCustomItem } from "../../types/types"
import Table from "./Nutrient Table/Table"
import { Cancel } from "@mui/icons-material"

const DisplayItems = ({items, removeItemFunc, referencedBy}:{items:(DBEntry|LinkedCustomItem)[], removeItemFunc:(index: number) => void, referencedBy:'diary'|'recipes'|'meals'}) =>{
    const content = items.map((item, index) => {
        if(isLinkedCustomItem(item)){
            const deleteItem = () => {
                removeItemFunc(index); 
                updateSingleReference(item.item.id, referencedBy, true)
            }
            if(isRecipe(item.item))
                return [item.item.recipeName, item.quantity.toFixed(2), item.item.servingDetails.servingName, " ", " ", <Cancel onClick={() => deleteItem()} className="pointer"/>]
            else if(isLinkedMeal(item.item))
                return [item.item.mealName, item.quantity.toFixed(2), 'Meal', " ", " ", <Cancel onClick={() => deleteItem()} className="pointer"/>]
            else 
                return [item.item?.foodName, item.quantity.toFixed(2), item.item?.servingDetails.measure, item.item?.servingDetails.grams*(item.quantity/item.item.servingDetails.quantity), <Cancel onClick={() => deleteItem()} className="pointer"/>]
        }
        else
            return [item.foodName, item.quantity.toFixed(2), item.servingName,  item.weight, <Cancel onClick={() => removeItemFunc(index)} className="pointer"/>]
    })

    return items.length > 0 && <Table titles={['Name', 'Amount', 'Unit', 'Weight (g)', ' ']}  addedTableClasses={{rowClass:'disp-items', tableClass:'display-items-chart'}}
        contents={content as (string | number | JSX.Element)[][]}/>
} 

 export default DisplayItems