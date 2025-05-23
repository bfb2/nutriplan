import { useState, useEffect } from "react"
import { retrieveDiaryEntry } from "../functions/indexdb"
import { ReturnedDiaryEntry, ReturnedDiaryEntries } from "../types/types"
import { NutritionSumTotal } from "../classes"

const useSavedData = ( indexKeyValue:string|number) =>{
    const [savedData, setSavedData] = useState<ReturnedDiaryEntry|ReturnedDiaryEntries>()
    const [indexKey, setIndexKey] = useState(indexKeyValue)
    //const [nutritionData, setNutritionData] = useState<NutritionSumTotal>(new NutritionSumTotal())

    if(indexKeyValue !== indexKey)
        setIndexKey(indexKeyValue)

    const [nonEmptyDays, setNonEmptyDays] = useState(0)
    const totalNutrients = new NutritionSumTotal(savedData)
    const accessSavedData = async (indexKey:string|number) => {
        
        if(typeof(indexKey) == 'number' || indexKey == 'all time'){
            let nonEmpty = 0;
            const diaryEntriesRange:ReturnedDiaryEntries = {dateRange:"", data:[]}
            if(indexKey == 'all time'){
                const allEntries = await retrieveDiaryEntry()
                const firstDate = allEntries[0].date
                const lastDate = allEntries[allEntries.length-1].date
                diaryEntriesRange.dateRange = `${firstDate} - ${lastDate}`
                
                allEntries.forEach(entry => {
                    nonEmpty++
                    diaryEntriesRange.data.push(entry)
                })
            }
            else{
            for (let index = 0; index < indexKey; index++) {
                const day = new Date()
                const diaryDate = new Date(day.setDate(day.getDate()-index)).toDateString().slice(4)
                const returnedData = await retrieveDiaryEntry(diaryDate)
                if(returnedData !== undefined){
                   diaryEntriesRange.data.push(returnedData)
                   nonEmpty++ 
                }}
            }
            setSavedData(diaryEntriesRange)
            setNonEmptyDays(nonEmpty) 
        }
        else if(typeof(indexKey) == 'string'){
            const returnedData = await retrieveDiaryEntry(indexKey)
              setSavedData(returnedData)
          }
    }
    useEffect(()=>{   
        accessSavedData(indexKey)
    }, [indexKey])

    return {savedData, setSavedData, totalNutrients, accessSavedData, nonEmptyDays}
} 



 export default useSavedData