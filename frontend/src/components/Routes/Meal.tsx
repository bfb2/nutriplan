import CustomItemsLanding from "../Miscellaneous/CustomItemsLanding"
import Label from "../Miscellaneous/Label"
import Input from "../Miscellaneous/Input"
import { AddCircle } from "@mui/icons-material"
import { useState } from "react"
import SearchFood from "../Miscellaneous/Modal/SearchFood"
import { DBEntry, LinkedCustomItem, Meals } from "../../types/types"
import { NutritionSumTotal } from "../../classes"
import DisplayItems from "../Miscellaneous/DisplayItems"
import { addEntryToDB, linkCustomItem } from "../../functions/indexdb"
import { checkForCircularReference, generateID, isUserLoggedIn, linkRecipesAndMeals, saveToMongo, updateReference } from "../../functions/general-use"
import ErrorMessage from "../Miscellaneous/ErrorMessage"

import useCustomItemError from "../../hooks/useCustomItemError"

const Meal = () =>{
    type CreateMeal = {[P in keyof Meals] : P extends 'mealItems' ? (DBEntry|LinkedCustomItem)[] : P extends 'referencedBy' ? Meals[P] & {referencedItems:(string|number)[]} : Meals[P]}
    const [errorMsg, setErrorMsg] = useState('')
    const [modalActive, setModalActive] = useState(false)
    
    const [mealDetails, setMealDetails] = useState<CreateMeal>({
        mealName: 'New Meal',
        mealItems:[],
        id:'',
        referencedBy:{
            diary:0,
            recipes:0,
            meals:0,
            referencedItems:[]
        }
    })
    const {CircleReferenceError, setLoopError, alertItemInUse, ItemUsedOtherPlacesModal} = useCustomItemError(mealDetails.referencedBy, "The item cannot be added because it creates a cycle")

    const {diary, recipes, meals, referencedItems} = mealDetails.referencedBy

    if(mealDetails.id == '')
        generateID().then(id => setMealDetails(prev =>({...prev, id})))

    const addToMealItems = async (item: DBEntry) => {
        if(typeof(item.key) == 'string'){
            const circularReference = await checkForCircularReference(item.key, mealDetails.id)
            if(circularReference){
                setModalActive(false)
                return setLoopError()
            }
        }
        setMealDetails(prev => ({...prev, mealItems:[...prev.mealItems, item], referencedBy:{...prev.referencedBy, referencedItems:[...prev.referencedBy.referencedItems, item.key]}}))
        if(errorMsg!== '')
            setErrorMsg('')
    }
    const removeMealItem = (index:number) => {
        const updatedMealItems = mealItems.toSpliced(index, 1)
        setMealDetails(prev => ({...prev, mealItems:updatedMealItems}))
        setDisplaySave(true)
    }

    const saveMealToDB = (event: React.FormEvent<HTMLFormElement>, newID?:string) => {
        const formData = new FormData(event.target as HTMLFormElement)
        const formObject = Object.fromEntries(formData.entries())
        const {mealName} = formObject as {mealName:string}
        if(mealItems.length == 0){
            setErrorMsg('Your Meal must have at least one item.')
            return
        }
        const {diary, meals, recipes} = mealDetails.referencedBy
        const data = {...mealDetails, mealName, mealItems:linkRecipesAndMeals(mealDetails.mealItems), referencedBy:{diary, meals, recipes}, ...(newID && {id:newID})}
        updateReference(mealDetails.referencedBy.referencedItems, 'meals')
        addEntryToDB('meal', data, data.id)
        setDisplaySave(false)
        setMealDetails(prev => ({...prev, mealName}))
        if(isUserLoggedIn())
            saveToMongo({data, itemType:'meal'})
    }
    const loadMealItem = (mealInfo: Meals) => {
        const linkedMealItems = linkCustomItem(mealInfo.mealItems)
        Promise.all(linkedMealItems).then(linkedData => 
            setMealDetails({
                mealItems:linkedData,
                mealName:mealInfo.mealName,
                id:mealInfo.id,
                referencedBy:{...mealInfo.referencedBy, referencedItems:[]}
            })
        )
        //setMealDetails(mealInfo)
    }

    
    

    const [displaySave, setDisplaySave] = useState(false)
    const {mealName, mealItems} = mealDetails
    const overallNutrition = new NutritionSumTotal(mealItems).nutrition
    
    return <>
        <CircleReferenceError/>
        <ItemUsedOtherPlacesModal/>
        <CustomItemsLanding itemID={mealDetails.id} nutritionData={overallNutrition} heading="Custom Meals" displaySave={displaySave} enterEditModeText="CREATE MEAL"
            exitEditModeText="BACK TO MEALS LIST" savedName={mealName} 
            onSave={(event)=>alertItemInUse(referencedItems.length > 0 && (diary > 0 || recipes >0 || meals >0),(id?:string)=>saveMealToDB(event, id),(id)=>setMealDetails(prev => ({...prev, id})),mealDetails.id ,'meal' )} 
            db="meal" resetState={() => {setMealDetails({mealName:'New Meal', mealItems:[], id:'', referencedBy:{diary:0,recipes:0, meals:0, referencedItems:[]}}); setErrorMsg(''); setDisplaySave(false)}}
            loadCustomItemInfoFunc={loadMealItem} interactiveNutrientTable={false} headingSubtext={headerSubtext} savedItemsSearchBarPlaceholder="Search through your meals..."
            savedItemsEmptyMsg="Click “Create Meal” above to get started.">
            <>
                {errorMsg.length >0 && <ErrorMessage message={errorMsg}/>}
                <Label labelName="Meal Name" passedClass="mt-25">
                    <Input name="mealName" defaultValue={mealName} onInput={()=>setDisplaySave(true)} extraClass="width100"/>
                </Label>

                <Label labelName="Meal Items" passedClass="mt-25">
                    <>
                        <button type='button' className="create-btn fw-600" onClick={() => setModalActive(true)}>
                            <AddCircle sx={{color:'#ff6733'}}/> &nbsp;Add Item
                        </button>
                        {modalActive && <SearchFood modalName="Add Item to Meal" toggleModalFunc={setModalActive} saveFoodFunc={(item) => {addToMealItems(item); setDisplaySave(true)}} addItemBtnText="ADD ITEM"/>}
                    </>
                </Label>
                <DisplayItems items={mealItems} removeItemFunc={removeMealItem} referencedBy="meals"/>
            </>
        </CustomItemsLanding>
    </>
} 



const headerSubtext = 'Use this feature to combine foods and recipes into a meal to log quickly to your Diary.'

 export default Meal