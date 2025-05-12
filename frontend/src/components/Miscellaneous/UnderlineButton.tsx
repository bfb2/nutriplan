

const UnderlineButton = ({name, onClick, buttonActive}:PropTypes) =>{
    return <button onClick={onClick} type="button"
        className={`underline-button ${buttonActive&&'active-underline'}`}>
            {name}
    </button>
} 

interface PropTypes{
    name:string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    buttonActive:boolean
}
 export default UnderlineButton