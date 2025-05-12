import BulletPoint from "./BulletPoint"
import { Nutrition } from "../../types/types"

const MacroValues = ({nutrition, flat = false} : PropTypes) =>{
    const {protein, calories, fat, carbs} = nutrition
    return <div className={`macroval-container ${flat && 'flat-macroval-con'}`}>
        <BulletPoint label="Protein" color="rgb(68, 208, 123)" shareOfCals={calcShareOfCals(protein, calories, 4)} value={protein}/>
        <BulletPoint label="Carbs" color="rgb(28, 202, 215)" shareOfCals={calcShareOfCals(carbs, calories, 4)} value={carbs}/>
        <BulletPoint label="Fat" color="rgb(234, 59, 4)" shareOfCals={calcShareOfCals(fat, calories, 9)} value={fat}/>
    </div>
} 

const calcShareOfCals = (val:number, total:number, multiplier:number) => {
    const calories = val*multiplier
    const fraction = isNaN(calories/total) ? 0 : calories/total
    if(fraction > 1)
        return 100
    return (fraction*100).toFixed(1)
}

interface PropTypes {
    flat?:boolean;
    nutrition:Nutrition
}

 export default MacroValues