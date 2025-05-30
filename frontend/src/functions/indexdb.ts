import {  DiaryEntry,  LinkedCustomItem, UserDefinedItems,CustomItem, DBEntry, SavedFoodDB, SavedMealDB, SavedRecipeDB, ReturnedDiaryEntry, DBEntrySavedItem, Meals, SavedRecipe, CustomFood,  } from "../types/types"
import { isDBEntrySavedItem, isDiaryEntry, isMeal, isRecipe } from "./general-use"
//const db,connectionToDB,transaction, returnedObjectStore;
/* export async function addEntryToDBNoIndexKey(dbName,value,updateIndex){
    const  returnedObjectStore = await connectToDB(dbName)
        /* if(updateIndex !== undefined){
            returnedObjectStore.put({
                data:value
            },parseInt(updateIndex))
        }
        else{
            returnedObjectStore.put({
                data:value
            }) 
        }  */         
        /* returnedObjectStore.put({
            data:value
        },parseInt(updateIndex))  */
        const indexKeys ={
            diary:'date',
            recipe:'id',
            meal:'id',
            food:'id'
        }

export  async function addEntryToDB(dbName:UserDefinedItems|'diary',dataToStore:CustomItem|DBEntry|DBEntrySavedItem,indexKeyValue:string, ){
     
        
            const returnedObjectStore = await connectToDB(dbName)
            const storedDataRequest:IDBRequest<DiaryEntry|CustomItem> = returnedObjectStore.get(indexKeyValue)
            storedDataRequest.onsuccess = () => {
                let storedData 
                if(storedDataRequest.result !== undefined){
                    if(isDiaryEntry(storedDataRequest.result))
                        storedData = [...storedDataRequest.result.data, dataToStore]
                    else
                        storedData = dataToStore  
                }
                else if(dbName == 'diary')
                    storedData = [dataToStore]
                else
                    storedData = dataToStore

                returnedObjectStore.put({
                    [indexKeys[dbName]]:indexKeyValue,
                    data:storedData,
                    hide:false
                })    
            }
            
    }



export default async function connectToDB(dbName:UserDefinedItems | 'diary'){
    const request = indexedDB.open(dbName,1) 
    request.onupgradeneeded=()=>{      
        const db = request.result 
           if(!db.objectStoreNames.contains(dbName))
            db.createObjectStore(dbName,{keyPath:indexKeys[dbName]})
        }  
       
    const db:IDBDatabase = await new Promise((resolve, reject)=> {       
            request.onsuccess= ()=> resolve(request.result)
            
            request.onerror= () => reject(new Error("Couldn't Find DB"))
    })
   
    const transaction = db.transaction(dbName,'readwrite')
    const returnedObjectStore = transaction.objectStore(dbName)
    return returnedObjectStore
}
export async function retrieveDiaryEntry(): Promise<ReturnedDiaryEntry[]>;
export async function retrieveDiaryEntry(date:string): Promise<ReturnedDiaryEntry|undefined>;
export async function retrieveDiaryEntry(date?:string): Promise<ReturnedDiaryEntry|undefined|ReturnedDiaryEntry[]>{
     const returnedObjectStore =  await connectToDB('diary')
     
     return new Promise((resolve)=>{
        if(date !== undefined){
            const request:IDBRequest<DiaryEntry|undefined> = returnedObjectStore.get(date)
            
            request.onsuccess=() => {
                /* const date = request.result.date
                const linkedData = request.result.data.map(entry => linkDiaryData(entry))
                Promise.all(linkedData).then(linkedDiary => resolve({date, data:linkedDiary})) */
                if(request.result !== undefined)
                    linkDiaryData(request.result).then(data => resolve(data))
                else
                    resolve(undefined)   
            }
            
        }
        else{
            const request:IDBRequest<DiaryEntry[]> = returnedObjectStore.getAll()
            request.onsuccess =() => {
                const diaryItems = request.result.map(entry=> linkDiaryData(entry))
                Promise.all(diaryItems).then(data => resolve(data))
            }
        }
        
    })
}

const linkDiaryData = ( diaryEntry:DiaryEntry) => {
    const date = diaryEntry.date
    const linkedData = linkCustomItem(diaryEntry.data)
    return Promise.all(linkedData).then(linkedDiary => ({date, data:linkedDiary}))

    /* if(isDBEntrySavedItem(entry)){
        const item = await retrieveItemByID(entry.id)
        if(item !== undefined)
            return {quantity:entry.quantity, item}
    }
    else 
        return entry */
}

export const linkCustomItem = (item:(DBEntry | DBEntrySavedItem)[]) : Promise<DBEntry | LinkedCustomItem>[] =>  {
    const linkedData = item.map(async entry => {
        if(isDBEntrySavedItem(entry)){
            const retrievedItem = await retrieveItemByID(entry.id) as Meals|SavedRecipe|CustomFood
                if(isMeal(retrievedItem)){
                   const linkedMealItems = linkCustomItem(retrievedItem.mealItems)
                    const linkedItems = await Promise.all(linkedMealItems).then(data => ({quantity:entry.quantity, item:{...retrievedItem, mealItems:data}}) )//item.mealItems= data)
                    return linkedItems
                }
                    
                else if(isRecipe(retrievedItem)){
                    const linkedIngredients = linkCustomItem(retrievedItem.ingredients)
                    return Promise.all(linkedIngredients).then(data => ({quantity:entry.quantity, item:{...retrievedItem, ingredients:data}}))//item.ingredients = data)
                }
                else
                    return {quantity:entry.quantity, item:retrievedItem} 
        }
        else 
            return entry
    })
    return linkedData
}

export const hideCustomItem = async (id:string, db:UserDefinedItems) => {
    let returnedItem: SavedFoodDB|SavedMealDB|SavedRecipeDB|undefined
        switch (db) {
            case 'food':
                returnedItem = await retrieveUserDefinedItems('food', id)
                break;
            case 'recipe':
                returnedItem =  await retrieveUserDefinedItems('recipe', id)
                break;
            case 'meal':
                returnedItem = await retrieveUserDefinedItems('meal', id);
                break;
            default:
                break;
        }
    if(returnedItem !== undefined){
        returnedItem.hide = true
        const returnedObjectStore = await connectToDB(db)
        returnedObjectStore.put(returnedItem)
    }
}


type RetrievedItemType = SavedFoodDB|SavedFoodDB[]|SavedMealDB|SavedMealDB[]|SavedRecipeDB|SavedRecipeDB[]|undefined
 export async function retrieveUserDefinedItems(db:'food'): Promise<SavedFoodDB[]>
 export async function retrieveUserDefinedItems(db:'food', id:string): Promise<SavedFoodDB|undefined>
 export async function retrieveUserDefinedItems(db:'recipe'): Promise<SavedRecipeDB[]>
 export async function retrieveUserDefinedItems(db:'recipe', id:string): Promise<SavedRecipeDB|undefined>
 export async function retrieveUserDefinedItems(db:'meal'): Promise<SavedMealDB[]>     
 export async function retrieveUserDefinedItems(db:'meal', id:string): Promise<SavedMealDB|undefined>
 export async function retrieveUserDefinedItems(db:UserDefinedItems, id?:string): Promise<RetrievedItemType>{ 
    const store = await connectToDB(db)
    return new Promise((resolve) => {
        if(id == undefined){
            const getAllItemsReq:IDBRequest<SavedFoodDB[] | SavedMealDB[] | SavedRecipeDB[]> = store.getAll()
            getAllItemsReq.onsuccess = () => {
                if(db == 'food'){
                    const results = getAllItemsReq.result as SavedFoodDB[]
                    const filteredResults:SavedFoodDB[] = []
                    results.forEach((item:SavedFoodDB) => !item.hide && filteredResults.push(item))
                    resolve(filteredResults)
                }
                    
                else if(db == 'recipe'){
                    const results = getAllItemsReq.result as SavedRecipeDB[]
                    const filteredResults:SavedRecipeDB[] = []
                    results.forEach((item:SavedRecipeDB) => !item.hide && filteredResults.push(item))
                    resolve(filteredResults)
                }

                else if(db == 'meal'){
                    const results = getAllItemsReq.result as SavedMealDB[]
                    const filteredResults:SavedMealDB[] = []
                    results.forEach((item:SavedMealDB) => !item.hide && filteredResults.push(item))
                    resolve(filteredResults)
                }
            }
    }
        else{
            const request:IDBRequest<RetrievedItemType> = store.get(id)
            request.onsuccess = () => resolve(request.result)
        }
    })
}

export const retrieveItemByID = async (id:string) => {
    const dbs:UserDefinedItems[] = ['recipe','food', 'meal']
    
    for (let index = 0; index < dbs.length; index++) {
        let result: SavedFoodDB|SavedMealDB|SavedRecipeDB|undefined
        switch (dbs[index]) {
            case 'food':
                result = await retrieveUserDefinedItems('food', id)
                break;
            case 'recipe':
                result =  await retrieveUserDefinedItems('recipe', id)
                break;
            case 'meal':
                result = await retrieveUserDefinedItems('meal', id);
                break;
            default:
                break;
        }
    
        if(result !== undefined)
            return result.data
    }
}

export const deleteUserDefinedItem = async (db:UserDefinedItems, id:string) => {
    const store = await connectToDB(db)
    store.delete(id)
}

/* export async function updateDBEntry(){

} */

/* export async function addToExistingDBEntry(dbName, indexKey,indexKeyValue, query,dataToAdd){
    const  returnedObjectStore = await connectToDB(dbName, index)
    dbEntry = {...dbEntry, dataToAdd}
    addEntryToDB(dbName, indexKey,indexKeyValue,dbEntry)
}   */

export async function importSavedItemsFromDB(dbName:UserDefinedItems, data: CustomItem[]){
    const  returnedObjectStore = await connectToDB(dbName);
    data.forEach(item => returnedObjectStore.put({id:item.id, data:item}))
}

export const importDiaryFromDB = async (diary:Record<string, DiaryEntry>) => {
    const returnedObjectStore = await connectToDB('diary')
    const dates = Object.keys(diary)
    dates.forEach(date => returnedObjectStore.put({date, data:diary[date]}))
}

export const clearPersonalData = async () => {
    const savedItems: (UserDefinedItems | 'diary')[] = ['diary', 'recipe', 'food', 'meal']
    savedItems.forEach(async item => {
        const returnedObjectStore = await connectToDB(item)
        returnedObjectStore.clear()
    })
}

export const removeDiaryItem = async (index:number, date:string) => {
    const returnedObjectStore = await connectToDB('diary')
    const request:IDBRequest<DiaryEntry> = returnedObjectStore.get(date)
    request.onsuccess = () => {
        request.result.data.splice(index, 1)
        returnedObjectStore.put({data:request.result.data, date})
    }
}

export async function getAllDBValues(dbName:UserDefinedItems | 'diary'){
    const returnedObjectStore =  await connectToDB(dbName)
        
    const returnedValue = await new Promise((resolve)=>{
    const request = returnedObjectStore.getAll()
        request.onsuccess=()=> resolve(request.result)    
    })

    return returnedValue
}
