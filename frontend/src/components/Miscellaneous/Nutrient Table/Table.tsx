import TableTitle from "./TableTitle"
import TableRow from "./TableRow"
import { useState } from "react"

const Table = ({addedTableClasses={titleClass:'', rowClass:'', tableClass:''}, 
        contents, titles, col, rowOnClick, hover, enableActive = false}:PropTypes) =>{
    const {titleClass, rowClass, tableClass} = addedTableClasses 
    const [selectedRow, setSelected] = useState<number>(-1)

    const onClickFunctions = (index:number, enableActive:boolean) => {
        if(rowOnClick?.[index]){
            if(enableActive)
                return () => {rowOnClick[index](); setSelected(index)} 
            return rowOnClick[index]
        }
        
        if(enableActive)
            return () => setSelected(index)
    }

    
    

    return <table className={`nutri-table ${tableClass} table-padding`}>
        <colgroup>{col}</colgroup>
        {titles && <TableTitle addedTitleClass={titleClass}  titles={titles}/>}
        {contents.map((item,index)=> 
            <TableRow tdClass={rowClass} key={`${item[0]} ${index}`} contents={item} 
                onClick={onClickFunctions(index, enableActive)} 
                hover={hover} active={index === selectedRow}
            /> 
        )}
    </table>
} 

interface PropTypes{
    addedTableClasses?:{
        titleClass?:string; 
        rowClass?:string; 
        tableClass?:string
    };
    contents:(JSX.Element| string| number)[][];
    titles?:string[];
    col?:number;
    rowOnClick?:(()=>void)[];
    hover?:boolean;
    enableActive?:boolean
}


 export default Table