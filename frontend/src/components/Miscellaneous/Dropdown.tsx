

const Dropdown = ({options, onChangeFunction,name}:PropTypes) =>{
    return <select name={name} className="dropdown" onChange={onChangeFunction}>
        {options.map(option => <option key={option}>{option}</option>)}
    </select>
} 

interface PropTypes{
    options:string[];
    onChangeFunction?:React.ChangeEventHandler<HTMLSelectElement>;
    name?:string
}
 export default Dropdown