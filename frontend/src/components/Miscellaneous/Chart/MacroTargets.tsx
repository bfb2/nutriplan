import { Nutrition } from "../../../types/types"
import Progress from "./Progress"
import { accessNutrientGoals } from "../../../functions/general-use"

const MacroTargets = ({nutrition}:{nutrition:Nutrition}) =>{
    const {calories, protein, carbs, fat} = nutrition
    const {protein:proteinGoal, energy:calorieGoal, carbohydrates:carbGoal, fat:fatGoal} = accessNutrientGoals()
   
    return <>
            <div className='border spacing'></div>
            <div className='spacing grow'>
                <div className='energy-sum-title'>Macronutrient Targets</div>
                <div>
                    <Progress value={calories} total={numOrString(calorieGoal)} color={'#9497a3'} label={'Energy'} secondaryLabel={'cal'}/>
                    <Progress value={protein} total={numOrString(proteinGoal)} color={'#44d07b'}  label={'Protein'} secondaryLabel={'g'}/>
                    <Progress value={carbs} total={numOrString(carbGoal)} color={'#1ccad7'} label={'Carbs'} secondaryLabel={'g'}/>
                    <Progress value={fat} total={numOrString(fatGoal)} color={'#ea3b04'} label={'Fat'} secondaryLabel={'g'}/>
                </div>
                
            </div>
    </>
} 

const numOrString = (value:'N/D'|number) => typeof(value) == 'number' ? value : 0  

 export default MacroTargets