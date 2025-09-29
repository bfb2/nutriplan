import { useState, useEffect } from "react"
import SearchBar from "./Input"
import TableRow from "./Nutrient Table/TableRow"
import { retrieveUserDefinedItems } from "../../functions/indexdb"
import { SavedRecipe, UserDefinedItems, Meals, CustomFood, CustomItemIndexDB, SavedRecipeDB, SavedMealDB, SavedFoodDB } from "../../types/types"

const SavedItems = ({getItemsInfo,searchBarPlaceholder,ifEmptyMessage, db}:PropTypes) =>{
    useEffect(() => {
        const loadDBValues = async () => {
            let values
            if(db == 'food')
                values = await retrieveUserDefinedItems('food')
            else if(db == 'recipe')
                values = await retrieveUserDefinedItems('recipe')
            else
                values = await retrieveUserDefinedItems('meal')
            
            setSavedItems({data:values, search:values})
        }
        loadDBValues()
    },[db])
    const [savedItems, setSavedItems] = useState<{data:CustomItemIndexDB[], search:CustomItemIndexDB[]}>({
        data: [], 
        search:[]
    })
    const processInput = (input:React.KeyboardEvent<HTMLInputElement>) => {
        const keyboardInput = input.target as HTMLInputElement
        const regexp = new RegExp('^'+keyboardInput.value,'i')
        const filteredDBData:CustomItemIndexDB[] = []
        if(isSavedRecipe(savedItems.data))
            filteredDBData.push(...savedItems.data.filter(item=>regexp.test(item.data.recipeName)))
        else if(isMealItem(savedItems.data))
            filteredDBData.push(...savedItems.data.filter(item=>regexp.test(item.data.mealName)))
        else if(isCustomFood(savedItems.data))
            filteredDBData.push(...savedItems.data.filter(item => regexp.test(item.data.foodName)))
        setSavedItems(prev => ({...prev, search:filteredDBData}))
    }

    return <div>
        <hr/>
        <SearchBar onInput={processInput} placeholder={searchBarPlaceholder}/>
        <div className="saved-items-container">
            {
                (savedItems.data == undefined || savedItems.search.length == 0) ?
                    <div className="pad1510">{ifEmptyMessage}</div>
                    :
                    displayItems(savedItems.search, getItemsInfo)
            }
        </div>
    </div>
} 

function isSavedRecipe(item:CustomItemIndexDB[]): item is SavedRecipeDB[]{
    if(item.length >0)
        return 'recipeName' in item[0].data
    return false
}

function isMealItem(item: CustomItemIndexDB[]): item is SavedMealDB[]{
    if(item.length >0)
        return 'mealName' in item[0].data
    return false
}

function isCustomFood(item:CustomItemIndexDB[]): item is SavedFoodDB[]{
    if(item.length>0)
        return 'foodName' in item[0].data
    return false
}


interface PropTypes{
    getItemsInfo:(item:SavedRecipe|Meals|CustomFood)=>void;
    db: UserDefinedItems;
    searchBarPlaceholder:string;
    ifEmptyMessage:string
}

const displayItems = (items:CustomItemIndexDB[], getItemsInfo:PropTypes['getItemsInfo'] ) =>{
    if(isSavedRecipe(items))
        return items.map((item) => <TableRow key={item.data.id} onClick={()=>getItemsInfo(item.data)} hover={true} 
            contents={[item.data.recipeName.trim().length == 0? 'Untitled': item.data.recipeName]} tdClass="saved-items"/>)
    if(isCustomFood(items))
        return items.map((item) => <TableRow key={item.data.id} onClick={()=>getItemsInfo(item.data)} hover={true} 
            contents={[item.data.foodName.trim().length == 0? 'Untitled': item.data.foodName]} tdClass="saved-items"/>)
    if(isMealItem(items))
        return items.map(item => <TableRow key={item.data.id} onClick={()=>getItemsInfo(item.data)} hover={true} 
                contents={[item.data.mealName.trim().length == 0? 'Untitled': item.data.mealName]} tdClass="saved-items"/>)
}

 export default SavedItems