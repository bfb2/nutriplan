import Dropdown from "../Miscellaneous/Dropdown"
import Label from "../Miscellaneous/Label"

interface PropTypes{
    onDayChange:React.ChangeEventHandler<HTMLSelectElement>;
    onFilterChange:React.ChangeEventHandler<HTMLSelectElement>
}

const ConfigureDailyAvg = ({onDayChange, onFilterChange}:PropTypes) =>{
    return <div className="container">
        <Label labelName="Daily Attributes For">
            <Dropdown options={avgSelections} onChangeFunction={onDayChange}/>
        </Label>
        <Label labelName="Filter Days" passedClass="mt-25">
            <Dropdown options={filterOptions} onChangeFunction={onFilterChange}/>
        </Label>
    </div>
} 

const avgSelections =[
    'Last 7 days',
    'Last 2 weeks',
    'Last 4 weeks',
    'Last 6 months',
    'Last year',
    'All time'
]

const filterOptions =[
    'All days',
    'Non-empty days'
]

 export default ConfigureDailyAvg