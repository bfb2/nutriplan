import ConfigureDailyAvg from "../Report/ConfigureDailyAvg";
import { useState } from "react";
import MacroTracker from "../Miscellaneous/Chart/MacroTracker";
import useSavedData from "../../hooks/useSavedData";
import TotalNutrientsTables from "../Miscellaneous/Nutrient Table/TotalNutrientsTables";
import {isReturnedDiaryEntries } from "../../functions/general-use";


export default function Report(){
    const date = new Date()
    const [dayRange, setDayRange] = useState(`${new Date(date.setDate(date.getDate()-7)).toDateString().slice(4)} - ${ new Date(date.setDate(date.getDate()+7)).toDateString().slice(4) }`)
    const [numOfDays, setNumOfDays] = useState<number|['all time', number]>(7)
    const [allDays, setAllDays] = useState(true)

    const updateDayRange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        const daySpan = numDaysOptions[event.target.selectedIndex]
             
        if(typeof(daySpan) == 'number'){
            const from = new Date(date.setDate(date.getDate()-daySpan)).toDateString().slice(4)
            const to = new Date(date.setDate(date.getDate()+daySpan)).toDateString().slice(4)
            setDayRange(`${from} - ${to}`)
        }
        setNumOfDays(daySpan)
    }

    const allOrNonEmptyDays = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setAllDays(event.target.selectedIndex == 0 ? true: false)
    }
    const {totalNutrients, nonEmptyDays, savedData} = useSavedData(typeof(numOfDays) == 'object' ? numOfDays[0] : numOfDays)
    if(savedData !== undefined && Array.isArray(numOfDays)){
        if(isReturnedDiaryEntries(savedData)){
            const [firstEntryDate, lastEntryDate] = savedData.dateRange.split(' - ')
            const days = (new Date(lastEntryDate).valueOf() - new Date(firstEntryDate).valueOf())/86400000
            if(numOfDays[1] !== days && dayRange !== savedData.dateRange){
                setNumOfDays(['all time', days])
                setDayRange(savedData.dateRange) 
            }    
        }
             
    }
    const {protein:{protein}, general:{energy:calories}, fat:{fat}, carbohydrates:{carbohydrates:carbs}} = totalNutrients.nutrition

    return <main className="outlet">
        <h1 className='heading heading-margin'>Nutrition Report</h1>
        <div className="heading-margin">View daily averages for a selected period of time.</div>
        <ConfigureDailyAvg onDayChange={updateDayRange} onFilterChange={allOrNonEmptyDays}/>
        <div className="date-range">{dayRange}</div>
        <MacroTracker nutrition={{
            calories:calories/(allDays ? typeof(numOfDays) == 'object' ? numOfDays[1] : numOfDays : nonEmptyDays), 
            carbs:carbs/(allDays ? typeof(numOfDays) == 'object' ? numOfDays[1] : numOfDays : nonEmptyDays), 
            fat:fat/(allDays ? typeof(numOfDays) == 'object' ? numOfDays[1] : numOfDays : nonEmptyDays), 
            protein:protein/(allDays ? typeof(numOfDays) == 'object' ? numOfDays[1] : numOfDays : nonEmptyDays)}}
        />
        <TotalNutrientsTables totalNutrients={totalNutrients.nutrition} divisor={(allDays ? typeof(numOfDays) == 'object' ? numOfDays[1] : numOfDays : nonEmptyDays)} interactive={false}/>
    </main>
}


const numDaysOptions:(number|['all time', number])[] = [7, 14, 28, 183, 365, ['all time', 0]]