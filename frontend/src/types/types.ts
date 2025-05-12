export interface CommonFoodsType{
    common_type: null;
    food_name: string;
    full_nutrients: Array<{value:number; attr_id:number}>;
    locale: string;
    photo:{highres:null|string; is_user_uploaded:boolean; thumb:string};
    serving_qty:number;
    serving_unit:string;
    serving_weight_grams:number;
    tag_id:string;
    tag_name:string;
}

export interface BrandedFoodsType{
    brand_name:string;
    brand_name_item_name:string;
    brand_type:number;
    food_name:string;
    full_nutrients: Array<{value:number; attr_id:number}>;
    locale: string;
    nf_calories:number;
    nf_metric_qty:500;
    nf_metric_uom:string;
    nix_brand_id: string;
    nix_item_id:string;
    photo: {thumb:string};
    region:number;
    serving_qty:number;
    serving_unit:string;
    serving_weight_grams:number|null
}

export type APIResponseFoods = [CommonFoodsType[] , BrandedFoodsType[]] | [BrandedFoodsType[], CommonFoodsType[]] 

export interface ReturnedFoodResponse{
    common:CommonFoodsType[];
    branded:BrandedFoodsType[];
}

export interface ExtraFoodInfo{
    foods:{
       alt_measures:{
            serving_weight:number;
            measure:string;
            seq:number;
            qty:number;
        }[]; 
    }[]
}

export interface Nutrition{
    
        calories:number,
        protein:number,
        carbs:number,
        fat:number,
    
    
}

export type ExtraServingInfo = ExtraFoodInfo['foods'][0]['alt_measures']

export interface DBEntry{
    foodName: string;
    weight: number| undefined;
    quantity: number;
    servingName: string;
    nutrients: BrandedFoodsType['full_nutrients'] | TrackedNutrients;
    key:string|number
}

export interface DBEntrySavedItem{
    id:string;
    quantity:number
}

export interface LinkedCustomItem{
    quantity:number;
    item:LinkedCustomItems
}

export type LinkedCustomItems = LinkedRecipes|CustomFood|LinkedMeals

export interface DiaryEntry{
    date: string
    data: (DBEntry|DBEntrySavedItem)[]
}

export interface ReturnedDiaryEntry{
    date:string;
    data:(DBEntry|LinkedCustomItem|undefined)[]
}

export interface ReturnedDiaryEntries{
    dateRange:string;
    data:ReturnedDiaryEntry[]
}

export type DiaryEntries = {
    dateRange:string; 
    data:DiaryEntry[]
}

export type CustomItemIndexDB = SavedRecipeDB | SavedMealDB | SavedFoodDB
interface SavedItemDB{
    id:string;
    hide:boolean
}

export interface SavedRecipeDB extends SavedItemDB{
    data:SavedRecipe;
}

export interface SavedMealDB extends SavedItemDB{
    data:Meals;
}

export interface SavedFoodDB extends SavedItemDB{
    data:CustomFood
}

export interface Meals{
    id:string;
    mealName: string;
    mealItems:(DBEntry|DBEntrySavedItem)[];
    referencedBy:CustomReferences
}



interface CustomReferences{
    diary:number;
    recipes:number;
    meals:number
}

export interface LinkedMeals{
    id:string;
    mealName:string;
    mealItems:(DBEntry|LinkedCustomItem)[];
    referencedBy:CustomReferences
}

interface Recipes{
    id:string;
    recipeName: string;
    servingDetails:{
        servingName:string,
        servings:number
    };
    notes: string;
    referencedBy:CustomReferences
}

export interface LinkedRecipes extends Recipes{
    ingredients:(DBEntry|LinkedCustomItem)[] 
}

export interface CreateRecipeState extends Recipes{
    ingredients:DBEntry[];
    defaultValue:number;
    referencedBy:CustomReferences & {referencedItems:(string|number)[]}
}

export interface SavedRecipe extends Recipes{
    
    ingredients:(DBEntry|DBEntrySavedItem)[];
    //nutrients: BrandedFoodsType['full_nutrients']
} 

export interface CustomFood{
    id:string;
    foodName: string;
    servingDetails:{
        quantity:number;
        measure: string;
        grams: number
    };
    notes: string;
    nutrients: TrackedNutrients;
    referencedBy:CustomReferences
}

export interface FoodInformtation{
        name:string;
            nutrients: TrackedNutrients | CommonFoodsType['full_nutrients'];
            startingWeight: number | undefined;
            macros:{
                protein:number;
                carbohydrates:number;
                energy:number;
                fat:number
            };
            key:number|string;
            serving:{
                qtyDefaults:number[],
                unit:string[],
                weightSelected:number,
                servingWeights:number[] | undefined;
                qtyInput: number
            };
    }

export type UserDefinedItems = 'recipe'|'food'|'meal'



export type DBTypes = CustomFood | Meals | DiaryEntry | SavedRecipe

export type CustomItem = CustomFood | Meals  | SavedRecipe

export interface Protein{
    protein:number,
    cystine:number,
    histidine:number,
    isoleucine:number,
    leucine:number,
    lysine:number,
    methionine:number,
    phenylalanine:number,
    threonine:number,
    tryptophan:number,
    tyrosine:number,
    valine:number
}

export interface General{
    energy:number,
    alcohol:number,
    caffeine:number,
    water:number
}

export interface Fat{
    fat:number,
    monounsaturated:number,
    polyunsaturated:number,
    saturated:number,
    'trans fats':number,
    cholesterol:number
}

export interface Carbs{
    carbohydrates:number,
    fiber:number,
    starch:number,
    'added sugar':number,
    sugars:number
}

export interface Minerals{
    calcium:number,
    copper:number,
    iron:number,
    magnesium:number,
    manganese:number,
    phosphorus:number,
    potassium:number,
    selenium:number,
    sodium:number,
    zinc:number,
    chromium:number
}

export interface Vitamins{
    thiamine:number,
    riboflavin:number,
    niacin:number,
    'pantothenic acid':number,
    pyridoxine:number,
    cobalamin:number,
    choline:number,
    folate:number,
    'vitamin a':number,
    'vitamin c':number,
    'vitamin d':number,
    'vitamin e':number,
    'vitamin k':number
}

interface GeneralWGetter extends General{
    _water:number
}

export interface TrackedNutrients{
    general : GeneralWGetter;
    carbohydrates : Carbs;
    fat: Fat;
    protein : Protein;
    minerals : Minerals;
    vitamins : Vitamins 
}

type NutrientTables = 'general'|'carbohydrates'|'fat'|'protein'|'protein'|'minerals'|'vitamins'

export type Nutrients = keyof General | keyof Protein | keyof Carbs | keyof Fat | keyof Minerals | keyof Vitamins