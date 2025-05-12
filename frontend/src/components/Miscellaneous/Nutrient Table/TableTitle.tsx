

interface PropTypes{
    titles:string[];
    colspan?:number;
    addedTitleClass: string|undefined;
}


const TableTitle = ({colspan,addedTitleClass, titles}:PropTypes) =>{
    return <tr style={{backgroundColor:'#e6e8f0'}}>

        {titles.map((title,index) => 
                <th className={`nutrition-table-ordering table-padding ${addedTitleClass}`} colSpan={colspan} key={index}>
                    {title}
                </th>
            )    
        }
            
</tr>
} 

 export default TableTitle