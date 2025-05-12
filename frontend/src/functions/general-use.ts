import { Nutrients, SavedRecipe, Meals, CustomFood, CustomItem, DBEntrySavedItem, LinkedCustomItem,UserDefinedItems, DiaryEntries, DiaryEntry, DBEntry, CustomItemIndexDB, SavedRecipeDB, SavedFoodDB, SavedMealDB, ReturnedDiaryEntry, ReturnedDiaryEntries, LinkedCustomItems, LinkedMeals, LinkedRecipes } from "../types/types"
import { rda, dashboardItems } from "../constants"
import { addEntryToDB, linkCustomItem, retrieveItemByID } from "./indexdb"

export const updateDailyLimits = (nutrient:Nutrients, evt:React.KeyboardEvent<HTMLInputElement>) => {
    const input = evt.target as HTMLInputElement
    const nutrientTargets = accessNutrientGoals()
    const userInput = parseFloat(input.value)
    if(isNaN(userInput))
        return
    nutrientTargets[nutrient] = userInput
    localStorage.setItem('nutrient targets', JSON.stringify(nutrientTargets))
    if(isUserLoggedIn()){
        const username = getCookieValue('user')
        fetch('http://localhost:5000/update-rda',{
            method:'POST',
            body:JSON.stringify({nutrient, value:userInput, username}),
            headers:{"Content-Type": "application/json"},
            credentials:'include'
        })
    }
}

export const clearPreferences = () => {
    localStorage.setItem('dashboard nutrients', JSON.stringify(dashboardItems))
    localStorage.setItem('nutrient targets', JSON.stringify(rda))
}

export const accessNutrientGoals = ():Record<Nutrients, number|'N/D'> => {
    return JSON.parse(localStorage.getItem('nutrient targets') || JSON.stringify(rda))
}

export const accessDisplayedDashboardNutrients = ():Record<Nutrients, boolean> => {
    return JSON.parse(localStorage.getItem('dashboard nutrients') || JSON.stringify(dashboardItems))
}

export function isMeal(item:CustomItem|undefined): item is Meals|LinkedMeals{
    if(item == undefined)
        return false
    return 'mealName' in item
}

export function isLinkedMeal(item:LinkedCustomItems|undefined): item is LinkedMeals{
    if(item == undefined)
        return false
    return 'mealName' in item
}

export function isLinkedCustomItem(entry:DBEntry | LinkedCustomItem | undefined): entry is LinkedCustomItem{
    if(entry == undefined)
        return false
    return 'item' in entry
}

export function isRecipe(item:LinkedCustomItems|undefined|CustomItem): item is SavedRecipe|LinkedRecipes{
    if(item == undefined)
        return false
    return 'recipeName' in item
}

export function isRecipes(savedItem:CustomItem[]): savedItem is SavedRecipe[]{
    console.log(savedItem, 'por')
    return 'recipeName' in savedItem[0]
}

export function isFoods(savedItem:CustomItem[]): savedItem is CustomFood[]{
    return 'foodName' in savedItem[0]
}

export function isMeals(savedItem: CustomItem[]): savedItem is Meals[]{
    return 'mealName' in savedItem[0]
}

export function isDiaryEntry(entry: DiaryEntry| DBEntry[]|DiaryEntries|CustomItem): entry is DiaryEntry{
    return 'date' in entry
}

export function isReturnedDiaryEntry(entry: ReturnedDiaryEntry|ReturnedDiaryEntries|undefined|(DBEntry | LinkedCustomItem)[]):entry is ReturnedDiaryEntry{
    if(entry == undefined)
        return false
    return 'date' in entry
}

export function isReturnedDiaryEntries(entry:ReturnedDiaryEntry|ReturnedDiaryEntries|undefined|(DBEntry | LinkedCustomItem)[]): entry is ReturnedDiaryEntries{
    if(entry == undefined)
        return false
    return 'dateRange' in entry
}

export function isDBEntry(entry:DBEntry|CustomItem): entry is DBEntry{
    return 'weight' in entry
}

export function isDiaryEntries(entry:DiaryEntry| DBEntry[]| DiaryEntries ): entry is DiaryEntries{
    return 'dateRange' in entry
}

export function isDBEntrySavedItem(item:DBEntrySavedItem|DBEntry): item is DBEntrySavedItem{
    return 'id' in item
}

export function isSavedRecipe(item:CustomItemIndexDB[]): item is SavedRecipeDB[]{
    if(item.length >0)
        return 'recipeName' in item[0].data
    return false
}

export function isMealItem(item: CustomItemIndexDB[]): item is SavedMealDB[]{
    if(item.length >0)
        return 'mealName' in item[0].data
    return false
}

export function isCustomFood(item:CustomItemIndexDB[]): item is SavedFoodDB[]{
    if(item.length>0)
        return 'foodName' in item[0].data
    return false
}

export function getCookieValue(cookie:string){
    const cookieParseRegex = new RegExp(`(?<=\\${cookie}\=)(.*?)(?=;|$)`, 'g')
    
    return document.cookie.match(cookieParseRegex)?.[0] 
}

export const isUserLoggedIn = () => {
    const loggedIn = getCookieValue('loggedInToken')
    return loggedIn == 'true'
}

export const parseLinkedItems = (items:(DBEntry | LinkedCustomItem)[], 
                                        recipeFN:(recipeInfo:LinkedRecipes)=>void, mealFN:(meal:LinkedMeals)=>void, foodFN:(food:CustomFood)=>void, dbEntryFN:(entry:DBEntry)=>void) => {
    if(items!== undefined)
        items.forEach(item => {
            if(isLinkedCustomItem(item)){
                const currentItem = item.item
                if(isRecipe(currentItem)){
                    recipeFN(currentItem)
                    parseLinkedItems(currentItem.ingredients, recipeFN, mealFN, foodFN, dbEntryFN)
                }
                else if(isLinkedMeal(currentItem)){
                    mealFN(currentItem)
                    parseLinkedItems(currentItem.mealItems, recipeFN, mealFN, foodFN, dbEntryFN)
                }
                else if(currentItem !== undefined)
                    foodFN(currentItem)
                
            }
            else
                dbEntryFN(item)
        })
}

export const updateReference = async (itemIds:(string|number)[], referencedBy:'diary'|'recipes'|'meals', dec?:boolean)  => {
    itemIds.forEach(async item => { 
        await updateSingleReference(item, referencedBy, dec)        
    })

}

export const updateSingleReference = async (item:string|number, referencedBy:'diary'|'recipes'|'meals', dec?:boolean) => {
    if(typeof(item) == 'string'){
        const retrievedItem = await retrieveItemByID(item)
        if(retrievedItem !== undefined){
            let type:UserDefinedItems ='food'
            if(isRecipe(retrievedItem))
                type = 'recipe'
            else if(isMeal(retrievedItem))
                type = 'meal'
            
            if(dec)
                retrievedItem.referencedBy[referencedBy]--
            else
                retrievedItem.referencedBy[referencedBy]++

            if(isUserLoggedIn())
                fetch('http://localhost:5000/save-custom-item',{
                    method:'POST',
                    body:JSON.stringify({username:getCookieValue('user'), retrievedItem, itemType:type}),
                    headers:{"Content-Type": "application/json"},
                    credentials: "include"
                })
            addEntryToDB(type, retrievedItem, item)
        }
    }
}

export const checkForCircularReference = async (id:string, startingId:string) => {
    if(id == startingId)
        return true

    const item = await retrieveItemByID(id)
    if(isRecipe(item)){
        const linkedItems = linkCustomItem(item.ingredients)
        const linkedItemsPromise = await Promise.all(linkedItems)
        return traverseReferences(linkedItemsPromise, startingId)
    }
    else if(isMeal(item)){
        const linkedItems = linkCustomItem(item.mealItems)
        const linkedItemsPromise = await Promise.all(linkedItems)
        return traverseReferences(linkedItemsPromise, startingId)
    }
    
        return false

}

const traverseReferences = (items:(DBEntry | LinkedCustomItem)[], startingId:string, ) => {
    for (let index = 0; index < items.length; index++) {
        const item = items[index]
        if(isLinkedCustomItem(item)){  
            const itemID = item.item.id
            if(startingId == itemID)
                return true
            else{
                if(isRecipe(item.item)){
                    const circularReference = traverseReferences(item.item.ingredients, startingId)
                    if(circularReference)
                        return true
                }
                if(isLinkedMeal(item.item)){
                    const circularReference = traverseReferences(item.item.mealItems, startingId)
                    if(circularReference)
                        return true
                }
            }
        }
    }
    return false

}

export function linkRecipesAndMeals(items:(DBEntry|LinkedCustomItem)[]) : (DBEntry|DBEntrySavedItem)[]
export function linkRecipesAndMeals(items:DBEntry|LinkedCustomItem): DBEntry|DBEntrySavedItem

export function linkRecipesAndMeals(items:(DBEntry|LinkedCustomItem)[]|DBEntry|LinkedCustomItem):(DBEntry|DBEntrySavedItem)[]| DBEntry| DBEntrySavedItem{
    if(Array.isArray(items))
        return items.map(item => generateSavedItemReference(item))
    else
        return generateSavedItemReference(items)
}

const generateSavedItemReference = (item:DBEntry|LinkedCustomItem) => {
    if(isLinkedCustomItem(item))
        return {quantity:item.quantity, id:item.item.id}
    if(typeof(item.key) == 'string')
        return {quantity:item.quantity, id:item.key}

    return item
}

export const saveToMongo = (data:{data:CustomItem, itemType:UserDefinedItems}) => {
    fetch('http://localhost:5000/save-custom-item',{
        method:'POST',
        body:JSON.stringify({...data, username:getCookieValue('user')}),
        headers:{"Content-Type": "application/json"},
        credentials:'include'
    })
}

export const generateID = async ():Promise<string> => {
    const id = crypto.randomUUID()
    const retrievedItem = await retrieveItemByID(id)
    if(retrievedItem == undefined)
        return id
    else 
        return generateID()
    
}
