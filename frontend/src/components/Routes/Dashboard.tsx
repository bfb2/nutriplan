import NutrientConsumption from "../Dashboard/NutrientConsumption"
import { accessDisplayedDashboardNutrients, isReturnedDiaryEntries } from "../../functions/general-use"
import { Nutrients, TrackedNutrients } from "../../types/types"
import useSavedData from "../../hooks/useSavedData"
import { NutritionSumTotal } from "../../classes"

export default function Dashboard(){
    const {savedData} = useSavedData(7);
    const dashboardNutrients = accessDisplayedDashboardNutrients()
    const displayedNutrients: string[] = []
    Object.keys(dashboardNutrients).forEach(nutrient=> dashboardNutrients[nutrient as Nutrients] && displayedNutrients.push(nutrient))

    
    
    const date = new Date();
    const lastWeek = new Date(date.setDate(date.getDate()-6));
      
    const last7Days=[date.toDateString().slice(4)];
    for (let index = 5; index >= 0; index--) {
        last7Days.push(new Date(lastWeek.setDate(lastWeek.getDate()+1)).toDateString().slice(4))
    }

    const weekOfNutrition: (TrackedNutrients|number)[] = [0, 0 ,0 ,0,0,0,0]

    if(savedData && isReturnedDiaryEntries(savedData)){
        savedData.data.forEach(diaryEntry => last7Days.forEach((day, index) => {
            if(diaryEntry.date == day){
                weekOfNutrition[index] = new NutritionSumTotal(diaryEntry).nutrition
            }
        }))
    }

    
    return<main className="outlet ">
        <h1 className="heading heading-margin">Your Dashboard</h1>
        <div className="content">
            {displayedNutrients.map(nutrient =>
                <NutrientConsumption  key={nutrient} nutrient={nutrient as Nutrients} nutritionData={weekOfNutrition} last7Days={last7Days}/>)}
        </div>
    </main> 
    
}