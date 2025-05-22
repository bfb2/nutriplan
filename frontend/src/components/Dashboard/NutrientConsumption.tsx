import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions, 
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Nutrients, TrackedNutrients } from '../../types/types';
import { nutrientTables, nutrientsNameAndLabel } from '../../constants';



const NutrientConsumption = ({ nutrient, nutritionData, last7Days}:{ nutrient:Nutrients, nutritionData:(TrackedNutrients|number)[], last7Days:string[]}) =>{  
    const nutrientGroup = nutrientTables.get(nutrient)
    const nutrientTable = nutrientTables.get(nutrient)
    const nutrientInfo = nutrientsNameAndLabel[nutrientTable as keyof TrackedNutrients]
    const nutrientLabel = nutrientInfo[nutrient as keyof typeof nutrientInfo]
    const pastWeekNutrientInfo = nutritionData.map(data => {
      if(typeof(data) == 'number')
        return data
      else 
        if(nutrientGroup !== undefined){
          const nutrientCategory = data[nutrientGroup]
          return nutrientCategory[nutrient as keyof typeof nutrientCategory]
        }
          
    })
    const data = {
      labels: last7Days,
      datasets: [
        {
          label: 'Consumed',
          data: pastWeekNutrientInfo,
          backgroundColor: '',
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio:false,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: `${(nutrient as string)[0].toLocaleUpperCase()+nutrient.slice(1)} Consumption (${nutrientLabel['measureLabel']})`,
        },
      },
    };

      
    return  <div className='chart'>
       <Bar data={data} options={options}/>
    </div>
           
} 






ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);




 export default NutrientConsumption