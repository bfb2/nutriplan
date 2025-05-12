import { useState } from "react"
import { TrackedNutrients } from "../../types/types"
import UnderlineButton from "../Miscellaneous/UnderlineButton"
import Table from "../Miscellaneous/Nutrient Table/Table"

const SettingsTable = ({heading, headingSubtext, generateTableContent, tableTitles}:PropsTypes) =>{
    const [activeBtn, setActiveBtn] = useState<keyof TrackedNutrients>('general')

    

    return <section className="container">
        <h2 className="margin0">{heading}</h2>
        <p >{headingSubtext}</p>
        <UnderlineButton name="General" buttonActive={activeBtn == 'general'} onClick={()=>setActiveBtn('general')}/>
        <UnderlineButton name="Carbohydrates" buttonActive={activeBtn == 'carbohydrates'} onClick={()=>setActiveBtn('carbohydrates')}/>
        <UnderlineButton name="Fat" buttonActive={activeBtn == 'fat'} onClick={()=>setActiveBtn('fat')}/>
        <UnderlineButton name="Protein" buttonActive={activeBtn == 'protein'} onClick={()=>setActiveBtn('protein')}/>
        <UnderlineButton name="Vitamins" buttonActive={activeBtn == 'vitamins'} onClick={()=>setActiveBtn('vitamins')}/>
        <UnderlineButton name="Minerals" buttonActive={activeBtn == 'minerals'} onClick={()=>setActiveBtn('minerals')}/>
        {activeBtn == 'general' && <Table titles={tableTitles} contents={generateTableContent('general')}/>}
        {activeBtn == 'carbohydrates' && <Table titles={tableTitles} contents={generateTableContent('carbohydrates')}/>}
        {activeBtn == 'protein' && <Table titles={tableTitles} contents={generateTableContent('protein')}/>}
        {activeBtn == 'fat' && <Table titles={tableTitles} contents={generateTableContent('fat')}/>}
        {activeBtn == 'vitamins' && <Table titles={tableTitles} contents={generateTableContent('vitamins')}/>}
        {activeBtn == 'minerals' && <Table titles={tableTitles} contents={generateTableContent('minerals')}/>}
    </section>
} 

interface PropsTypes{
    heading: string;
    headingSubtext:string;
    generateTableContent:(nutrientGroup: keyof TrackedNutrients) => JSX.Element[][];
    tableTitles: string[]
}

 export default SettingsTable