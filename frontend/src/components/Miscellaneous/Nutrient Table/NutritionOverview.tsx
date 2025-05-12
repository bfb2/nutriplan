import CalorieBreakdown from "../Chart/CalorieBreakdown"
import { Nutrition } from "../../../types/types"
import MacroValues from "../MacroValues"

const NutritionOverview = ({nutrition}: Nutrition) =>{
    return <section className="container">
        <h2>Nutrition Overview</h2>
        <p>Percent daily values (DV%) are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your targets.</p>
    
        <div className="flex col">
            <CalorieBreakdown nutrition={nutrition}/>
            <MacroValues nutrition={nutrition} flat={true}/>
        </div>
        
    </section>
} 

 export default NutritionOverview