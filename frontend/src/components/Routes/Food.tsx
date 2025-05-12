import { useState } from "react"
import CustomItemsLanding from "../Miscellaneous/CustomItemsLanding"
import Label from "../Miscellaneous/Label"
import Table from '../Miscellaneous/Nutrient Table/Table'
import Input from "../Miscellaneous/Input"
import TextArea from "../Miscellaneous/TextArea"
import { addEntryToDB } from "../../functions/indexdb"
import { NutritionSumTotal } from "../../classes"
import { CustomFood, TrackedNutrients } from "../../types/types"
import { saveToMongo, generateID, isUserLoggedIn } from "../../functions/general-use"
import useCustomItemError from "../../hooks/useCustomItemError"

const Food = () =>{
    const [nutrientsChanged, setNutrientsChanged] = useState<boolean>(false)
    const [foodDetails, setFoodDetails] = useState<CustomFood>({
        foodName: 'New Food',
        servingDetails:{
            grams:1,
            quantity:1,
            measure:'Serving'
        },
        nutrients:new NutritionSumTotal().nutrition,
        notes:'',
        id:'',
        referencedBy:{
            diary:0,
            meals:0,
            recipes:0       
        }
    })
    if(foodDetails.id == '')
            generateID().then(id=>setFoodDetails(prev => ({...prev, id})))
    const resetState = () => setFoodDetails({foodName:'New Food', servingDetails:{grams:1, quantity:1, measure:'Serving'}, nutrients:new NutritionSumTotal().nutrition, notes:'', id:'', referencedBy:{diary:0,recipes:0,meals:0}})
    const {foodName, servingDetails:{grams, quantity, measure}, nutrients, id, referencedBy:{diary, recipes, meals}} = foodDetails
    const {ItemUsedOtherPlacesModal, alertItemInUse} = useCustomItemError(foodDetails.referencedBy)

    const [displaySave, setDisplaySave] = useState(false)

    const tableContent = [
        [   
            <Input name="quantity" defaultValue={quantity} extraClass="width20" />,
            <Input name="measure" defaultValue={measure} extraClass="width58"/>,
            <Input name="grams" defaultValue={grams} extraClass="width40"/>
        ],
    ]

    const loadContent = (data: CustomFood) => {
        setFoodDetails(data)
    }
    
    const updateNutrients = (nutrientGroup:keyof TrackedNutrients  , value:string, nutrient: keyof typeof nutrientGroup) => {
        setFoodDetails(prev =>({
            ...prev, 
            nutrients:{
                ...prev.nutrients, 
                [nutrientGroup]:{
                    ...prev.nutrients[nutrientGroup],
                    [nutrient]:Number(value) 
                }
            }
        }))
        setDisplaySave(true)
        setNutrientsChanged(true)
    }
    
    const saveItemToDB = (event: React.FormEvent<HTMLFormElement>, newID?:string) => {
        const formData = new FormData(event.target as HTMLFormElement)
        const formObject = Object.fromEntries(formData.entries())
        const {foodName, notes, quantity, measure, grams} = formObject as {foodName:string, notes:string, quantity:string, measure:string, grams:string}
        const data:CustomFood ={...foodDetails, foodName, notes, servingDetails:{quantity, measure, grams}, ...(newID && {id:newID})}
        if(isUserLoggedIn())
            saveToMongo({data, itemType:'food'})
        addEntryToDB('food', data, data.id)
        setDisplaySave(false)
        setFoodDetails(prev => ({...prev, foodName}))
        setNutrientsChanged(false)
    }
    return  <>
        <ItemUsedOtherPlacesModal/>
        <CustomItemsLanding itemID={foodDetails.id} heading="Custom Foods" headingSubtext="Create a new food from the nutrition facts on a product label."
                 enterEditModeText="Add Food" exitEditModeText="Back To Foods" savedName={foodName} displaySave={displaySave}
                 onSave={(e) => alertItemInUse(nutrientsChanged && (recipes >0 || diary>0|| meals>0), (id?:string)=>saveItemToDB(e, id), (id)=>setFoodDetails(prev => ({...prev, id})), foodDetails.id, 'food')} 
                 resetState={resetState} interactiveNutrientTable={true} nutritionData={nutrients} updateNutritionData={updateNutrients} db="food" 
                 loadCustomItemInfoFunc={loadContent} savedItemsSearchBarPlaceholder="Search through your foods..."
                 savedItemsEmptyMsg="Click “Create Food” above to get started."
            >
                <>
                    <Label labelName="Food Name" passedClass="col" >
                        <Input defaultValue={foodDetails.foodName} onInput={() => setDisplaySave(true)} name="foodName"/>
                    </Label>
                    <Label labelName="Serving Size" passedClass="mt-25 col">
                        <Table titles={['#', 'Measure', 'Grams']} contents={tableContent} addedTableClasses={{tableClass:'mt0'}}/>
                    </Label>
                    <Label labelName="Notes" passedClass="mt-25 col">
                        <TextArea onInput={() => setDisplaySave(true)} name="notes"/>
                    </Label>
                </>
                
        </CustomItemsLanding>
    </>

} 





 export default Food