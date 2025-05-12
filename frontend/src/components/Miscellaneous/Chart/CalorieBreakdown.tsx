import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut,  } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { Nutrition } from '../../../types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

const CalorieBreakdown = ({title, nutrition}:PropTypes) =>{
    const {protein, carbs, calories, fat} = nutrition

    const chartData = calories == 0 || (protein ==0 && carbs == 0 && fat == 0) ? 
        [1] : [protein*4,carbs*4,fat*9]

    const chartColors = calories == 0 || (protein ==0 && carbs == 0 && fat == 0) ? 
        ['#e6e6e6'] : ['rgba(68, 203, 123, 1)','rgba(28, 202, 215, 1)','rgba(234, 59, 4, 1)']

        const data:ChartData<'doughnut'> = {
            labels: calories !== 0 ?  ['Protein', 'Carbs', 'Fat'] : [],
            datasets: [
              {
                data:chartData ,
                backgroundColor:chartColors ,
                borderColor: calories ==0 ||  (protein ==0 && carbs == 0 && fat == 0)? 
                  ['rgba(230, 230, 230, 0.2)']
                :
                [
                  'rgba(68, 203, 123, 0.2)',
                  'rgba(28, 202, 215, 0.2)',
                  'rgba(234, 59, 4, 0.2)'
                ],
                borderWidth: 1,
              },
            ],
          };
          
    return <div className='height-fit-cont energy-chart'>
        {typeof(title) !== 'undefined' && <div className='energy-sum-title'>{title}</div>}
        <div className='energy-chart'>
            <Doughnut className='js-center inherit' data={data} options={options} redraw={true}/>
            <div className='cals'>
                <div className='cal-num'>{Math.round(calories)}</div>
                <div className='cal-label'>cals</div>
            </div>
        </div>
        
        
    </div>
} 

const options:ChartOptions<'doughnut'> = {
    animation:{duration:0},
    responsive:false,
      plugins:{
          legend:{
              display:false,
          },
          tooltip:{
              enabled:false
          }
      }
  }

  

const findPercentage = (array:number[], numToDivideBy:number) :number => {
    const sum =array.reduce((accumulator, currentVal) => accumulator + currentVal, 0)
    return Math.round((numToDivideBy/sum)*100)    
}

interface PropTypes {
    title?:string;
    nutrition:Nutrition
}


 export default CalorieBreakdown