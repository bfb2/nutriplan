

interface PropTypes{
    key: string|number;
    onClick?: React.MouseEventHandler<HTMLTableCellElement>;
    rowRef?: React.LegacyRef<HTMLTableCellElement>;
    hover?:boolean;
    tdClass?:string|undefined;
    rowClass?:string|undefined;
    contents:(string | number | JSX.Element)[];
    active?:boolean
}

const TableRow = ({key,onClick, rowRef, hover=false, tdClass, rowClass, contents, active}:PropTypes) =>{
    return <tr className={`nutrition-tr ${rowClass}`} key={key}>
        {contents.map((content)=>
                <td key={key} onClick={onClick} align='left' ref={rowRef} 
                    className={ `nutrition-table-ordering  ${hover && 'table-row-hover pointer clickable-td'} ${active && 'active'} ${tdClass}`} 
                >
                    {content}
                </td>
            )
        }
    </tr>
} 

 export default TableRow