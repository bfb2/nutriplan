import { TrackedNutrients } from "../../types/types"
import Input from "../Miscellaneous/Input"
import { Nutrients } from "../../types/types"
import { general, protein, vitamins, minerals, carbs, fat } from "../../constants"
import { updateDailyLimits, accessNutrientGoals, accessDisplayedDashboardNutrients, isUserLoggedIn, getCookieValue } from "../../functions/general-use"
import SettingsTable from "../Settings/SettingsTable"

const Settings = () =>{
    const targetsTitles = ['Nutrient', 'Daily Target', '']
    const dashboardTitles = ['Nutrient', 'Displayed', '']
    return <main className="outlet">
        <h1 className="heading heading-margin">Settings</h1>
        
        <SettingsTable heading='Dashboard'
            headingSubtext='Choose which nutrients you want displayed on your dashboard'
            generateTableContent={generateDashboardTable} 
            tableTitles={dashboardTitles}
        />
        <SettingsTable heading='Nutrient Targets' 
            headingSubtext='Customize your targets to reach a weight goal or address your specific health needs.'
            generateTableContent={generateNutrientTargetsTable}
            tableTitles={targetsTitles}
        />
        
    </main>
} 

const generateNutrientTargetsTable = (nutrientGroup:keyof TrackedNutrients) => {
    const tableAccessed = nutrientNameAndLabel[nutrientGroup]
    const tableKeys = Object.keys(tableAccessed) as Nutrients[]
    const nutrientTargets = accessNutrientGoals()
    return tableKeys.map(key => [tableAccessed[key as keyof typeof tableAccessed]['name'], <Input  onInput={e => updateDailyLimits(key,e)} extraClass="width35" defaultValue={nutrientTargets[key]}/>,tableAccessed[key as keyof typeof tableAccessed]['measureLabel'] ])
}

const generateDashboardTable = (nutrientGroup: keyof TrackedNutrients) => {
    const tableAccessed = nutrientNameAndLabel[nutrientGroup]
    const tableKeys = Object.keys(tableAccessed) as Nutrients[]
    const displayedDashboardNutrients = accessDisplayedDashboardNutrients()

    return tableKeys.map(tableKey => {
        const nutrientDisplayed = displayedDashboardNutrients[tableKey]
        return [tableAccessed[tableKey as keyof typeof tableAccessed]['name'], 
            <input type="checkbox" defaultChecked={nutrientDisplayed&& true} onClick={()=>updateDashboard(displayedDashboardNutrients, !nutrientDisplayed, tableKey)}/>
        ]
    })
}

const updateDashboard = (settings:Record<Nutrients, boolean>, value:boolean, nutrient:Nutrients) => {
    settings[nutrient] = value;
    localStorage.setItem('dashboard nutrients', JSON.stringify(settings))
    if(isUserLoggedIn()){
        fetch('http://localhost:5000/update-dashboard',{
            method:'POST',
            body:JSON.stringify({nutrient, value:value}),
            headers:{"Content-Type": "application/json"},
            credentials:'include'
        })
    }

}

const nutrientNameAndLabel = {
    general, carbohydrates:carbs, protein, vitamins, minerals, fat
}
 export default Settings