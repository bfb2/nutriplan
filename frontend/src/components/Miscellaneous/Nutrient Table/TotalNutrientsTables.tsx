import NutrientTable from "./Table"
import { TrackedNutrients } from "../../../types/types"
import { nutrientsNameAndLabel } from "../../../constants"
import { Nutrients } from "../../../types/types"
import { accessNutrientGoals } from "../../../functions/general-use"
import Input from "../Input"
import { DiaryEntries, DiaryEntry } from "../../../types/types"
import { NutritionSumTotal } from "../../../classes"

interface PropTypes{
    totalNutrients: TrackedNutrients; 
    divisor?:number; 
    interactive:boolean;
    
    updateNutrients?: (nutrientGroup: keyof TrackedNutrients, value: string, nutrient: keyof typeof nutrientGroup) => void
}
const TotalNutrientsTables = ({totalNutrients, divisor, interactive =false, updateNutrients}:PropTypes) =>{
    /* const groups = Object.keys(totalNutrients)
    const [generalContent, carbContent, proteinContent, fatContent, vitaminContent, mineralContent] = 
        groups.map(group => {
            const nutrientSubGroup = totalNutrients[group as keyof typeof totalNutrients]
            const nutrientNameLabelSubGroup = nutrientsNameAndLabel[group as keyof typeof nutrientsNameAndLabel]
            const nutrients = Object.keys(nutrientSubGroup)
            return nutrients.map(nutrient => {
                const nutrientName = nutrientNameLabelSubGroup[nutrient as keyof typeof nutrientNameLabelSubGroup]['name']
                const nutrientValue = nutrientSubGroup[nutrient as keyof typeof nutrientSubGroup]
                const nutrientLabel = nutrientNameLabelSubGroup[nutrient as keyof typeof nutrientNameLabelSubGroup]['measureLabel']
                return [nutrientName, nutrientValue, nutrientLabel]
            })
    }) */
  
    //const test = new NutritionSumTotal(data)
    const generateTableContent = (nutrientGroup:keyof TrackedNutrients) => {
        const tableAccessed = nutrientsNameAndLabel[nutrientGroup]
        const tableKeys = Object.keys(tableAccessed) as Nutrients[]
        const nutrientTargets = accessNutrientGoals()
        const nutrientValuesGroup = totalNutrients[nutrientGroup]
        return tableKeys.map(key => {
            const nutrientName =  tableAccessed[key as keyof typeof tableAccessed]['name'];
            const nutrientValue = divisor == undefined? (nutrientValuesGroup[key as keyof typeof nutrientValuesGroup]) as number : (nutrientValuesGroup[key as keyof typeof nutrientValuesGroup])/divisor
            const nutrientLabel = tableAccessed[key as keyof typeof tableAccessed]['measureLabel']
            const consumedOfDailyLimit = typeof(nutrientTargets[key]) == 'number' ? `${((nutrientValue/nutrientTargets[key])*100).toFixed(1)} %` : 'N/T'

            if(interactive && updateNutrients !== undefined)
                return [nutrientName, 
                <Input defaultValue={nutrientValue} onBlur={(e) => updateNutrients(nutrientGroup, e.target.value, key as keyof Nutrients)} extraClass="width40"/>, 
                nutrientLabel,
                consumedOfDailyLimit
            ]

            return [nutrientName, nutrientValue.toFixed(2), nutrientLabel, consumedOfDailyLimit]
        }
      )
    }
     
    return <section className="container">
        <h2>Nutrient Targets</h2>
        <NutrientTable titles={['General','Amount', "", '% DV']} contents={generateTableContent('general')} col={5}/>
        <NutrientTable titles={['Carbohydrates','Amount', "", '% DV']} contents={generateTableContent('carbohydrates')} col={5}/>
        <NutrientTable titles={['Lipids','Amount', "", '% DV']} contents={generateTableContent('fat')} col={5}/>
        <NutrientTable titles={['Vitamins','Amount', "", '% DV']} contents={generateTableContent('vitamins')} col={5}/>
        <NutrientTable titles={['Minerals','Amount', "", '% DV']} contents={generateTableContent('minerals')} col={5}/>
        <NutrientTable titles={['Protein','Amount', "", '% DV']} contents={generateTableContent('protein')} col={5}/>
        <div>N/T = No Target</div>
    </section>
} 



 export default TotalNutrientsTables