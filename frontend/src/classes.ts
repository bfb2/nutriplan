import { TrackedNutrients, DBEntry, ReturnedDiaryEntry, ReturnedDiaryEntries, LinkedCustomItem, CommonFoodsType } from "./types/types"
import nutrientIds, {nutrientTables} from "./constants"
import { isLinkedMeal, isReturnedDiaryEntries, isReturnedDiaryEntry, isTrackedNutrients } from "./functions/general-use"

import {  isRecipe,isLinkedCustomItem } from "./functions/general-use"


export class NutritionSumTotal{
    nutrition: TrackedNutrients = {
        general:{
            energy:0,
            alcohol:0,
            caffeine:0,
            _water:0,
            get water(){
                return this._water/1000
            },
            set water(amount){
                this._water = amount 
            }
    },
        carbohydrates:{
            carbohydrates:0,
            fiber:0,
            starch:0,
            'added sugar':0,
            sugars:0
    },
        fat:{
            fat:0,
            monounsaturated:0,
            polyunsaturated:0,
            saturated:0,
            'trans fats':0,
            cholesterol:0
    },
        vitamins:{
            thiamine:0,
            riboflavin:0,
            niacin:0,
            'pantothenic acid':0,
            pyridoxine:0,
            cobalamin:0,
            choline:0,
            folate:0,
            'vitamin a':0,
            'vitamin c':0,
            'vitamin d':0,
            'vitamin e':0,
            'vitamin k':0
    },
        minerals:{
            calcium:0,
            copper:0,
            iron:0,
            magnesium:0,
            manganese:0,
            phosphorus:0,
            potassium:0,
            selenium:0,
            sodium:0,
            zinc:0,
            chromium:0
    },
        protein:{
            protein:0,
            cystine:0,
            histidine:0,
            isoleucine:0,
            leucine:0,
            lysine:0,
            methionine:0,
            phenylalanine:0,
            threonine:0,
            tryptophan:0,
            tyrosine:0,
            valine:0
    }}
    
//dbData?:ReturnedDiaryEntry | DBEntry[] | ReturnedDiaryEntries
    constructor(dbData?:ReturnedDiaryEntry  | ReturnedDiaryEntries| undefined| (DBEntry | LinkedCustomItem)[]|TrackedNutrients, divisor:number=1){
        if(dbData == undefined)
            return
        if(isReturnedDiaryEntry(dbData)){
            this.#processDiaryEntry(dbData, divisor)
        }
        else if(isReturnedDiaryEntries(dbData)){
            dbData.data.forEach(day => this.#processDiaryEntry(day, divisor))
        }
        else if(isTrackedNutrients(dbData)){
            this.#handleTrackedNutrients(dbData, divisor)
        }
         else{
            dbData.forEach(data => this.#handleSavedData(data, divisor))
        } 
               
    }

    #processDiaryEntry(diaryEntry:ReturnedDiaryEntry, divisor:number){
        diaryEntry.data.forEach(entry => {
                if(isLinkedCustomItem(entry)){
                    if(isRecipe(entry.item))
                        this.#handleSavedData(entry, entry.item.servingDetails.servings)
                    else
                        this.#handleSavedData(entry, divisor)
                }
                else
                    this.#handleSavedData(entry, divisor)}
            )
    }

    #updateNutrients(nutrient: CommonFoodsType['full_nutrients'][0], divisor:number){
        const nutrientName = nutrientIds.get(nutrient.attr_id)
        if(nutrientName !== undefined){
            const nutrientGroup = nutrientTables.get(nutrientName)
                if(nutrientGroup !== undefined){
                    const nutrientCat = this.nutrition[nutrientGroup];
                    (nutrientCat[nutrientName as keyof typeof nutrientCat] as number) += nutrient.value/divisor
                }
        }
    }

    #handleSavedData(entry:DBEntry | LinkedCustomItem | undefined, divisor:number){
        if(isLinkedCustomItem(entry)){
            
            if(isRecipe(entry.item)){
                const recipe = entry.item
                recipe.ingredients.forEach(ingredient => this.#handleSavedData(ingredient, (1/entry.quantity)*divisor))
                    
                    /* ingredient.nutrients.forEach(nutrient => 
                        this.#updateNutrients(nutrient, recipe.servingDetails.servings/entry.quantity))) */
            }
                
            else if(isLinkedMeal(entry.item)){
                const meal = entry.item
                meal.mealItems.forEach(mealItem => {
                        this.#handleSavedData({...mealItem, quantity:mealItem.quantity*entry.quantity}, divisor)
                        /* this.#handleSavedData(mealItem, divisor)
                    else
                        mealItem.nutrients.forEach(nutrient => this.#updateNutrients(nutrient, 1/mealItem.quantity))  */ 
                })
            }
                
            else if(entry !== undefined){
                const customFood = entry.item
                this.#handleTrackedNutrients(customFood.nutrients, customFood.servingDetails.quantity/(entry.quantity/divisor))
                /* const nutrientTables = Object.keys(customFood.nutrients) as (keyof TrackedNutrients)[]
                nutrientTables.forEach(table =>{
                    const nutrients = Object.keys(customFood.nutrients[table]) as Nutrients[]
                    const nutrientGroup = this.nutrition[table]
                    
                    nutrients.forEach(nutrient => nutrientGroup[nutrient as keyof typeof nutrientGroup] += customFood[table][nutrient as keyof typeof nutrientGroup])
                }) */
            }   
            
        }
        else{
            if(entry!== undefined){
                if(Array.isArray(entry.nutrients))
                    entry.nutrients.forEach(nutrient => this.#updateNutrients(nutrient,divisor))
                else
                    this.#handleTrackedNutrients(entry.nutrients, divisor)
            }
                
        }
    }
    #handleTrackedNutrients(nutrientData:TrackedNutrients, servings?:number){
        const nutrientTables = Object.keys(nutrientData) as (keyof TrackedNutrients)[]
        nutrientTables.forEach(table => {
            const tableGroup = this.nutrition[table]
            const nutrients = Object.keys(tableGroup)
            const importedTableGroup = nutrientData[table]
            nutrients.forEach(nutrient =>
                (tableGroup[nutrient as keyof typeof tableGroup] as number) += importedTableGroup[nutrient as keyof typeof importedTableGroup] / (servings ?? 1)
            )
        })
    }
}