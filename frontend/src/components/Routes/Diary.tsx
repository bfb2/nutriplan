import AddToDiary from "../Diary/AddToDiary"
import MacroTracker from "../Miscellaneous/Chart/MacroTracker"
import DateSelector from "../Diary/DateSelector"
import { useState } from "react";
import useSavedData from "../../hooks/useSavedData";
import TotalNutrientsTables from "../Miscellaneous/Nutrient Table/TotalNutrientsTables";

export default function Diary(){
    const [day, setDay] = useState(new Date(new Date().setDate(new Date().getDate())));
    const {savedData:diaryItems, totalNutrients, accessSavedData} = useSavedData(day.toDateString().slice(4))
    
    return <main className="outlet">
        <DateSelector day={day} setDay={setDay}/>
        <AddToDiary day={day} diaryEntries={diaryItems} refreshDiary={accessSavedData} />
        <MacroTracker nutrition={{
            calories:totalNutrients.nutrition.general.energy, 
            fat:totalNutrients.nutrition.fat.fat,
            carbs:totalNutrients.nutrition.carbohydrates.carbohydrates,
            protein:totalNutrients.nutrition.protein.protein
        }}/>
        <TotalNutrientsTables totalNutrients={totalNutrients.nutrition} interactive={false}/>
    </main>
}