import MacroTargets from './MacroTargets'
import CalorieBreakdown from './CalorieBreakdown'
import { Nutrition } from '../../../types/types'

const MacroTracker = ({nutrition}:{nutrition:Nutrition}) =>{
    return <div className='container flex col targets'>
        <CalorieBreakdown nutrition={nutrition} title='Energy Summary'/>
        <MacroTargets nutrition={nutrition}/>
    </div>
} 

 export default MacroTracker