import Table from "../Nutrient Table/Table"
import { useState, useEffect} from "react"
import { APIResponseFoods, CommonFoodsType, BrandedFoodsType, DBEntry, SavedRecipe, CustomFood, Meals, TrackedNutrients } from "../../../types/types"
import CalorieBreakdown from "../Chart/CalorieBreakdown"
import nutrientIds from "../../../constants"
import Label from "../Label"
import Dropdown from "../Dropdown"
import Input from "../Input"
import { getDifferentServingSizes } from "../../../functions/api"
import MacroValues from "../MacroValues"
import { isRecipes, isMeals, isFoods,} from "../../../functions/general-use"
import { linkCustomItem } from "../../../functions/indexdb"
import { NutritionSumTotal } from "../../../classes"

const DisplaySearchedFood = ({results, tableKey, saveFoodFunc, addItemBtnText}:PropsTypes ) => {
    const [selectedItem, setSelectedItem] = useState<FoodItem>({
        name:'',
        nutrients:[],
        startingWeight:0,
        macros:{
            energy:0,
            protein:0,
            carbohydrates:0,
            fat:0
        },
        key:-1,
        serving:{
            unit:[''],
            qtyDefaults:[], 
            weightSelected:0,
            servingWeights:[],
            qtyInput:1
        }
    })

    const [resultData, setResultData] = useState<{loading:boolean, onClickFuncs:(()=>void)[], names:string[][]}>({loading:false, onClickFuncs:[], names:[]})
    
    useEffect(()=>{
        setResultData({loading:true, names:[], onClickFuncs:[]})
        if(results.length == 0 || results == undefined)
            setResultData({loading:false, names:[], onClickFuncs:[]})
        else if(isAPIResponse(results)){
            if(results?.[0]?.length ==0 && results?.[1]?.length == 0)
                return setResultData({loading:false, onClickFuncs:[], names:[['No results found - check your spelling, try alternatives, or create a Custom Food']]})
            
            let firstHalfData, secondHalfData
            if(isBrandedFirst(results)){
                const [firstFoodGroup, secondFoodGroup] = results
                    firstHalfData  = firstFoodGroup.map(processBrandedFoods)
                    secondHalfData = secondFoodGroup.map(processCommonFoods)
            }
            else{
                const [firstFoodGroup, secondFoodGroup] = results
                firstHalfData = firstFoodGroup.map(processCommonFoods)
                secondHalfData = secondFoodGroup.map(processBrandedFoods)
            }
    
            const [firstHalfNames, firstHalfOnClickFuncs] = sortNamesAndFuncs(firstHalfData)
            const [secondHalfNames, secondHalfOnClickFuncs] = sortNamesAndFuncs(secondHalfData)
            
            return setResultData({loading:false, names:[...firstHalfNames, ...secondHalfNames], onClickFuncs:[...firstHalfOnClickFuncs, ...secondHalfOnClickFuncs]})
        }
        else{
            const tableContent:[string][]=[], getItemInfoFuncs:Promise<Func>[] = []
            
            if(isRecipes(results)){
                
               results.forEach((item) =>{
                tableContent.push([item.recipeName])
                
                const servings = item.servingDetails.servings
                //const retrievedItem = retrieveItemByID(item.id)
                getItemInfoFuncs.push(Promise.all(linkCustomItem(item.ingredients)).then(linkedItems => {
                    
                    const nutritionInfo = new NutritionSumTotal(linkedItems, servings).nutrition
                    const macros = {protein:nutritionInfo.protein.protein, energy:nutritionInfo.general.energy, carbohydrates:nutritionInfo.carbohydrates.carbohydrates, fat:nutritionInfo.fat.fat}
                    return ()=>setSelectedItem({
                        name:item.recipeName, 
                        key:item.id,
                        startingWeight:undefined,
                        serving:{
                            unit:[item.servingDetails.servingName],
                            servingWeights:undefined, 
                            qtyDefaults:[1], 
                            weightSelected:0, 
                            qtyInput:1 
                        },
                        macros,
                        nutrients:nutritionInfo
                    })
                }))
               })
            }
            else if(isMeals(results)){
                results.forEach((item) => {
                    tableContent.push([item.mealName])
                    /* const nutrients = item.mealItems.flatMap(({nutrients}) => nutrients)
                    const macros = getMacroValues(nutrients) */
                    getItemInfoFuncs.push(Promise.all(linkCustomItem(item.mealItems)).then(linkedItems => {
                        const nutritionInfo = new NutritionSumTotal(linkedItems).nutrition
                        const macros = {protein:nutritionInfo.protein.protein, energy:nutritionInfo.general.energy, carbohydrates:nutritionInfo.carbohydrates.carbohydrates, fat:nutritionInfo.fat.fat}
                        
                        return ()=>setSelectedItem({
                            name:item.mealName,
                            key:item.id,
                            startingWeight:undefined,
                            serving:{
                                unit:['Meal'],
                                servingWeights:undefined, 
                                qtyDefaults:[1], 
                                weightSelected:0, 
                                qtyInput:1 
                            },
                            macros,
                            nutrients:nutritionInfo
                        })
                    }))
                })
            }
            else if(isFoods(results)){
                results.forEach((item) => {
                    tableContent.push([item.foodName])
                    
                    const nutrients = item.nutrients
                    const macros = {
                        energy:nutrients.general.energy, 
                        carbohydrates:nutrients.carbohydrates.carbohydrates,
                        protein:nutrients.protein.protein,
                        fat:nutrients.fat.fat
                    };
                    getItemInfoFuncs.push(new Promise(resolve => resolve(()=>setSelectedItem({
                        name:item.foodName,
                        nutrients,
                        macros,
                        key:item.id,
                        startingWeight:item.servingDetails.grams,
                        serving:{
                            unit: [item.servingDetails.measure],
                            servingWeights:[item.servingDetails.grams],
                            qtyDefaults:[item.servingDetails.quantity],
                            weightSelected:0,
                            qtyInput:item.servingDetails.quantity
                        }
                    }))))
                })
            }
           
            Promise.all(getItemInfoFuncs).then(funcs => setResultData({loading:false, names:tableContent, onClickFuncs:funcs}))
        }
    }, [results])
    
    const updateSelectedQty = (evt : React.ChangeEvent<HTMLInputElement>) => {
        const input = evt.target.value
        //const qtyInput = parseFloat(input.value)
        if(!isNaN(qtyInput))
            setSelectedItem(prev => ({...prev, serving:{...prev.serving, qtyInput:Number(input)}}))
    }

    const {macros:{energy, carbohydrates, fat, protein}, serving:{weightSelected, servingWeights, qtyInput, qtyDefaults}, startingWeight} = selectedItem
    const weightRatio = (servingWeights?.[weightSelected] ?? 1) / (startingWeight ?? 1);
    const quantityRatio = qtyInput / qtyDefaults[weightSelected]
    const calValue = (energy * weightRatio) * quantityRatio
    const proteinValue = protein * weightRatio * quantityRatio
    const carbValue = carbohydrates * weightRatio * quantityRatio
    const fatValue = fat * weightRatio * quantityRatio

    const prepareNutritionDataForDB = () => {
        const {name:foodName,nutrients, serving:{qtyInput, weightSelected, servingWeights, unit}, key } = selectedItem

        const adjustedNutrientValues = Array.isArray(nutrients) ? 
            nutrients.map(nutrient => ({...nutrient, value: nutrient.value* weightRatio * quantityRatio}))
            : new NutritionSumTotal(nutrients, 1/quantityRatio).nutrition

        const weight = servingWeights ? 
            servingWeights[weightSelected] * (unit[weightSelected] == 'g' ? qtyInput/100 : qtyInput) 
            : undefined

        saveFoodFunc({foodName, nutrients:adjustedNutrientValues, weight, quantity:qtyInput, servingName:unit[weightSelected], key})
    }
    

    const processCommonFoods = (food:CommonFoodsType, index:number): [[string],()=>void] =>{
        const macroVals = getMacroValues(food.full_nutrients)
        const getDetails = async () =>{
            const servingInfo = await getDifferentServingSizes(food.food_name)
            const servingUnits: string[] =[], servingQtys:number[] =[], servingWeights: number[]=[]

            servingInfo.forEach(({serving_weight, measure, qty}) => {
                servingUnits.push(measure);
                servingQtys.push(qty);
                servingWeights.push(serving_weight)
            })

            setSelectedItem({name:food.food_name, nutrients:food.full_nutrients,startingWeight:food.serving_weight_grams, 
                macros:macroVals, key:index, 
                serving:{unit:servingUnits, qtyDefaults:servingQtys, weightSelected:0, servingWeights, qtyInput:servingQtys[0]}})
        }

        return  [[food.food_name], getDetails]
     }
     
     const processBrandedFoods = (food:BrandedFoodsType, index:number): [[string],()=>void] => {
        const macroVals = getMacroValues(food.full_nutrients)

        const weightDefined = food.serving_weight_grams ? 
            {
                startingWeight:food.serving_weight_grams, 
                unit:[food.serving_unit, 'g'], 
                qtyDefaults: [food.serving_qty, 100], 
                servingWeights:[food.serving_weight_grams, 100]
            }
        : 
            {
                startingWeight:undefined,
                unit:[food.serving_unit], 
                qtyDefaults: [food.serving_qty], 
                servingWeights: undefined
            }

        const {startingWeight, unit, qtyDefaults, servingWeights} = weightDefined
        
        return  [
            [food.brand_name_item_name], 
            () => setSelectedItem({
                name:food.brand_name_item_name, 
                nutrients:food.full_nutrients, startingWeight, 
                macros:macroVals, 
                key:index, 
                serving:{unit, qtyDefaults, weightSelected:0, servingWeights, qtyInput:food.serving_qty}
            })
        ]
     }

    return <>
        <div className="table-container">
            <Table titles={['Name']} key={tableKey}
                contents={resultData.names} hover={resultData.onClickFuncs.length > 0 ? true : false}
                rowOnClick={resultData.onClickFuncs} enableActive={true} addedTableClasses={{rowClass:resultData.onClickFuncs.length == 0 ? 'center-row' : ''}} 
            />
        </div>
        
            <div className="modal-item-name">{selectedItem.name}</div>
            {displayItemDetails(selectedItem) && 
                <>
                    <div className="flex nutrient-breakdown-pos gry-outline">
                        <CalorieBreakdown nutrition={{calories:calValue, protein:proteinValue, carbs:carbValue, fat:fatValue}}/>
                        <MacroValues nutrition={{calories:calValue, protein:proteinValue, fat:fatValue, carbs:carbValue}}/>
                    </div>
                    <Label labelName="Serving Size" passedClass="serving-pos gry-outline" labelClass="m4">
                        <div className="flex gap10">
                            <Input defaultValue={selectedItem.serving.qtyDefaults[weightSelected]} extraClass="width35" onChange={updateSelectedQty}/>
                            <Dropdown key={selectedItem.name} options={selectedItem.serving.unit} onChangeFunction={(evt) => setSelectedItem(prev => ({...prev, serving:{...prev.serving, weightSelected:evt.target.selectedIndex, qtyInput:prev.serving.qtyDefaults[evt.target.selectedIndex]}}))}/>
                        </div>
                    </Label> 
                    <button type='button' onClick={prepareNutritionDataForDB} className="modal-submit-pos grn-btn">{addItemBtnText}</button> 
                </>          
            }
    </>
}

const sortNamesAndFuncs = (namesAndFuncs: [[string], () => void][]):TableContent => {
    const [foodNames, rowOnClickFuncs] = namesAndFuncs.reduce<TableContent>(
        ([fgroup,sgroup], [foodName, func]) => 
            [[...fgroup, foodName],[...sgroup, func]],[[],[]]
    )
    return [foodNames, rowOnClickFuncs] 
} 

const getMacroValues = (nutrients:CommonFoodsType['full_nutrients']) =>{
    const macroVals:FoodItem['macros'] = {energy:0,protein:0,carbohydrates:0,fat:0};
    nutrients.forEach(nutrient=>{
        if(macroIds.includes(nutrient.attr_id)){
            const macro = nutrientIds.get(nutrient.attr_id) as keyof FoodItem['macros']
            macroVals[macro] += nutrient.value
        }
    })
    return macroVals
}

interface PropsTypes{
    results:APIResponseFoods | [] | CustomFood[] | SavedRecipe[]| Meals[]; 
    tableKey:string;
    saveFoodFunc: (data: DBEntry) => void;
    addItemBtnText:string
}

type TableContent = [[string][], (()=>void)[]]

export interface FoodItem{
    name:string;
    nutrients: TrackedNutrients | CommonFoodsType['full_nutrients'];
    startingWeight: number | undefined;
    macros:{
        protein:number;
        carbohydrates:number;
        energy:number;
        fat:number
    };
    key:number|string;
    serving:{
        qtyDefaults:number[],
        unit:string[],
        weightSelected:number,
        servingWeights:number[] | undefined;
        qtyInput: number
    };

}

function isBrandedFirst(data: APIResponseFoods): data is [BrandedFoodsType[], CommonFoodsType[]] {
    if(data[0].length == 0){
        return 'brand_name' in data[1][0]
    }
    return 'brand_name' in data[0][0]
}

function isAPIResponse(data: ResultsTypes): data is APIResponseFoods{
     if(Array.isArray(data[0]) && Array.isArray(data[1]))
        return true
    return false  
    
}

const displayItemDetails = (selectedItem:FoodItem) => {
    if(Array.isArray(selectedItem.nutrients))
        return selectedItem.nutrients.length > 0
    else 
        return 'general' in selectedItem.nutrients
}

type ResultsTypes = APIResponseFoods | SavedRecipe[] | Meals[] | CustomFood[]
const macroIds = [208,203,205,204]

type Func = () => void
export default DisplaySearchedFood