import { useState, useEffect } from "react"
import SearchBar from "../Input"
import UnderlineButton from "../UnderlineButton"
import DisplaySearchedFood from "./DisplaySearchedFood"
import { processQuery } from "../../../functions/api"
import { APIResponseFoods, CustomFood, DBEntry, Meals, SavedRecipe } from "../../../types/types"
import Modal from "./Modal"
import { retrieveUserDefinedItems } from "../../../functions/indexdb"

const SearchFood = ({saveFoodFunc, modalName, toggleModalFunc, addItemBtnText}:PropTypes) =>{
    const [activeBtn, setActiveBtn] = useState<keyof SavedResults['results']>('online')
    const [query, setQuery] = useState<SavedResults>({
        results:{
            online:[],
            recipes:[],
            foods:[],
            meals:[],
        },
        query: ''
    })

    useEffect(()=>{
        const getSavedItems = async () =>{
           const savedRecipes = (await retrieveUserDefinedItems('recipe'))
           const savedFoods = await retrieveUserDefinedItems('food')
           const savedMeals = await retrieveUserDefinedItems('meal')

           setQuery(prev => ({...prev, results:{...prev.results, recipes:savedRecipes.map(recipe => recipe.data), foods:savedFoods.map(food=>food.data), meals:savedMeals.map(meal => meal.data)}}))
        }
        getSavedItems()
    },[])

    const processSearchInput = async (evt:React.KeyboardEvent<HTMLInputElement>) =>{
        const input = evt.target as HTMLInputElement
        if(input.value.length> 2){
            const results = await processQuery(input.value)
            setQuery(prev => ({...prev, results:{...prev.results, online:results}, query: input.value}))
        }
    }

    return <Modal modalTitle={modalName} toggleStateFunction={toggleModalFunc}>
        <>
            <SearchBar extraClass="searchbar-modal-pos" placeholder={displayPlaceholder(activeBtn)} onInput={processSearchInput}/>

            <div className="search-tabs modal-btns-pos">
                <UnderlineButton buttonActive={activeBtn == 'online'} 
                     onClick={()=>setActiveBtn('online')}
                     name="Online Foods"
                />
        
                <UnderlineButton name="Recipes" buttonActive={activeBtn == 'recipes'}
                     onClick={()=>setActiveBtn('recipes')}            
                />

                <UnderlineButton name="Custom Foods" buttonActive={activeBtn == 'foods'}
                     onClick={()=> setActiveBtn('foods')}
                />
    
                <UnderlineButton name="Meals" buttonActive={activeBtn == 'meals'}
                     onClick={()=>setActiveBtn('meals')}
                />
            </div>
            <DisplaySearchedFood results={query.results[activeBtn]} tableKey={activeBtn+query.query} saveFoodFunc={saveFoodFunc} addItemBtnText={addItemBtnText}/>
        </>
    </Modal>
} 


const displayPlaceholder = (activeBtn:(string|undefined)) =>{
    switch (activeBtn) {
        case 'recipes':
            return 'Search for recipes...'
        case 'meals':
            return 'Search for meals...'
        default:
            return 'Search for foods...'
            
    }
}

interface SavedResults{
    results:{
        online:APIResponseFoods | [];
        recipes:SavedRecipe[];
        foods:CustomFood[];
        meals:Meals[];
    };
    query:string;
}

interface PropTypes{
    modalName: string;
    toggleModalFunc: React.Dispatch<React.SetStateAction<boolean>>;
    saveFoodFunc: (data:DBEntry)=>void;
    addItemBtnText:string
}

 export default SearchFood