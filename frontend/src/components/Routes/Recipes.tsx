import CustomItemsLanding from "../Miscellaneous/CustomItemsLanding"
import { useState} from "react"
import { DBEntry, SavedRecipe, CreateRecipeState, } from "../../types/types"
import Label from "../Miscellaneous/Label"
import Input from "../Miscellaneous/Input"
import SearchFood from "../Miscellaneous/Modal/SearchFood"
import TextArea from "../Miscellaneous/TextArea"
import { AddCircle, } from "@mui/icons-material"
import { addEntryToDB, linkCustomItem } from "../../functions/indexdb"
import DisplayItems from "../Miscellaneous/DisplayItems"
import { NutritionSumTotal } from "../../classes"
import { isUserLoggedIn, saveToMongo, updateReference } from "../../functions/general-use"
import ErrorMessage from "../Miscellaneous/ErrorMessage"
import { generateID, linkRecipesAndMeals, checkForCircularReference } from "../../functions/general-use"
import useCustomItemError from "../../hooks/useCustomItemError"

const Recipes = () =>{
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [details, setDetails] = useState<CreateRecipeState>({
            recipeName:'New Recipe',
            ingredients:[],
            servingDetails:{
                servingName:'Serving',
                servings:1
            },
            defaultValue:1,
            notes:'', 
            id:'',
            referencedBy:{
                diary:0,
                recipes:0,
                meals:0,
                referencedItems:[]
            }
        })
        const {diary, recipes, meals, referencedItems} = details.referencedBy
    const {CircleReferenceError, ItemUsedOtherPlacesModal, alertItemInUse, setLoopError} = useCustomItemError(details.referencedBy, "The ingredient cannot be added because it creates a cycle")
    const overallNutrition = new NutritionSumTotal(details.ingredients, details.servingDetails.servings).nutrition
    const [modalState, setModalState] = useState(false)
    const [displaySave, setDisplaySave] = useState(false)

    if(details.id == '')
        generateID().then(id=>setDetails(prev => ({...prev, id})))
    
    const removeIngredient = (index:number) => {
            setDetails(prev => ({...prev, ingredients:prev.ingredients.toSpliced(index, 1)}))
            setDisplaySave(true)
    }

    const saveToDBRemoveSaveBtnUpdateName = (event: React.FormEvent<HTMLFormElement>, id?:string) => {
        const formData = new FormData(event.target as HTMLFormElement)
        const formObject = Object.fromEntries(formData.entries())
        const {recipeName, notes, servingName, servingsAmnt} = formObject as {recipeName:string, notes:string, servingName:string, servingsAmnt:string}
           
        if(details.ingredients.length == 0){
            setErrorMsg('Your Recipe must have at least one item.')
            return
        }

        const ingredients = linkRecipesAndMeals(details.ingredients) 
        const {diary, recipes, meals} = details.referencedBy
        const data = {
            recipeName, 
            ingredients, 
            servingDetails:{servingName, servings:parseFloat(servingsAmnt)}, 
            notes, 
            id: id ? id : details.id, 
            referencedBy:{diary, meals, recipes}
        }
        updateReference(details.referencedBy.referencedItems, 'recipes')
        if(isUserLoggedIn())   
            saveToMongo({data, itemType:'recipe'})   
        addEntryToDB('recipe', data, data.id)
        
        setDetails(prev => ({...prev, recipeName}))
        setDisplaySave(false)
    }

        const saveIngredient = async (ingredient:DBEntry) => {
            if(typeof(ingredient.key) == 'string'){
                const circularReference = await checkForCircularReference(ingredient.key, details.id)

                if(circularReference){
                    setModalState(false)
                    return setLoopError()
                }
                    
            }
                
            setDisplaySave(true);
            setDetails(prev => ({...prev, ingredients:[...prev.ingredients, ingredient], referencedBy:{...prev.referencedBy, referencedItems:[...prev.referencedBy.referencedItems, ingredient.key]}}));
            setErrorMsg('')
        }

        const importRecipe = async (data:SavedRecipe) => {
           const linkedItems = linkCustomItem(data.ingredients)
           Promise.all(linkedItems).then(ingredients => setDetails({
                recipeName:data.recipeName, 
                ingredients:ingredients, 
                servingDetails:data.servingDetails, 
                notes:data.notes, 
                id:data.id,
                defaultValue:data.servingDetails.servings,
                referencedBy:{...data.referencedBy, referencedItems:[]}
            }))
            
        }
            
        const updateServings = (evt:React.KeyboardEvent<HTMLInputElement>) => {
            const input = evt.target as HTMLInputElement
            const userInput = parseFloat(input.value)
            if(isNaN(userInput))
                return
            setDetails(prev => ({...prev, servingDetails:{...prev.servingDetails, servings:userInput}}))
        }

     return <>
        <CircleReferenceError/>
        <ItemUsedOtherPlacesModal/>
        <CustomItemsLanding itemID={details.id} heading="Custom Recipes" headingSubtext="Create a new recipe to quickly log your common meals."
                enterEditModeText="Add Recipe" exitEditModeText="Back To Recipes"  db={'recipe'} loadCustomItemInfoFunc={importRecipe} 
                displaySave={displaySave} savedName={details.recipeName} 
                onSave={(e)=> alertItemInUse(referencedItems.length>0 && (diary>0 || recipes>0 || meals>0), (id?:string)=> saveToDBRemoveSaveBtnUpdateName(e, id), (id)=>setDetails(prev => ({...prev, id})), details.id, 'recipe')} resetState={() => setDetails({recipeName:'New Recipe', ingredients:[], servingDetails:{servingName:'Serving', servings:1}, notes:'', id:'', defaultValue:1, referencedBy:{diary:0, recipes:0, meals:0, referencedItems:[]}})}
                nutritionData={overallNutrition} savedItemsSearchBarPlaceholder="Search for a specfic recipe" savedItemsEmptyMsg="Click “Add Recipe” above to get started." interactiveNutrientTable={false}
                
            >
            <>
                {errorMsg.length >0 && <ErrorMessage message={errorMsg}/>}
                <Label labelName="Recipe Name" passedClass="mt-25">
                    <Input defaultValue={details.recipeName} onInput={()=>{setDisplaySave(true)}} name="recipeName" extraClass="width100"/>
                </Label>

                <Label labelName="Ingredients" passedClass="mt-25">
                    <>
                        <button type='button' className="create-btn fw-600" onClick={() => setModalState(true)}>
                            <AddCircle sx={{color:'#ff6733'}}/> &nbsp;Add Ingredients
                        </button>
                        {modalState && <SearchFood modalName="Add Ingredients to Recipe" toggleModalFunc={setModalState} saveFoodFunc={saveIngredient} addItemBtnText="ADD TO RECIPE"/>}
                    </>     
                </Label>

                <DisplayItems items={details.ingredients} removeItemFunc={removeIngredient} referencedBy="recipes"/>

                <Label labelName="Serving Sizes" passedClass="mt-25">
                    <div className="flex jc-sb"> 
                        <div>
                            <label>Serving Name</label>
                            <Input defaultValue={details.servingDetails.servingName} name="servingName" extraClass="med-input" onInput={()=>{ setDisplaySave(true)}}/>
                        </div>
                        <div>
                            <label>Servings Per Recipe</label>
                            <Input defaultValue={details.defaultValue} name="servingsAmnt" extraClass="med-input" onInput={(evt)=>{setDisplaySave(true); updateServings(evt)}} /> 
                        </div>

                    </div>
                </Label>
                <Label labelName="Notes" passedClass="mt-25">
                    <TextArea onInput={() => setDisplaySave(true)} name="notes" defaultValue={details.notes}/>
                </Label>
            </>
        </CustomItemsLanding>
     </>
} 

export type SavedRecipeState = {[P in keyof SavedRecipe]: P extends 'recipeName' ? {name:string, saved:string} : SavedRecipe[P]} & {key: number|undefined}

 export default Recipes