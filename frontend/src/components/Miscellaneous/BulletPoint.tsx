

const BulletPoint = ({color, value, shareOfCals, label}:PropsTypes) => {
    const nutrientValue = typeof(value) == 'string' ? parseFloat(value) : value
        return <div className="flex textnowrap">
            <span className='bullet' style={{backgroundColor:color}}></span>
            <span className='macrovalue-label'>
                {`${label}: ${nutrientValue.toFixed(1)}`}
                <span style={{color}}>{` (${shareOfCals}%)`}</span>
            </span>
        </div>
} 

interface PropsTypes{
    color:string;
    value:number|string;
    shareOfCals: number|string;
    label:string
}
 export default BulletPoint