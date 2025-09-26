import { APIResponseFoods, ReturnedFoodResponse,ExtraFoodInfo, ExtraServingInfo  } from "../types/types";

export async function processQuery(query:string):Promise<APIResponseFoods> {
    const response = await fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${query}&detailed=true`,{
        method:'GET',
        headers:{
            'x-app-id':import.meta.env.VITE_API_ID,
            'x-app-key':import.meta.env.VITE_API_KEY,
            'x-remote-user-id':'0'
        },
    })
    const queryResults: ReturnedFoodResponse = await response.json();
    if ('message' in queryResults){
        //"usage limits exceeded"
        return {error:'API food search limit reached'}
    }
    const foodItem = queryResults.common?.[0]?.food_name

    if(foodItem == query.toLowerCase()){
        return [queryResults.common, queryResults.branded]  
    } 
    return [queryResults.branded, queryResults.common]
}

export async function getDifferentServingSizes(query:string) :Promise<ExtraServingInfo>{
   
    const response = await fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`,{
        method:'POST',
        headers:{
            'x-app-id':import.meta.env.VITE_API_ID,
            'x-app-key':import.meta.env.VITE_API_KEY,
            'x-remote-user-id':'0',
            'Content-Type': "application/json"
        },
        body:JSON.stringify({query:`${query}`})
    })
    const queryResults:ExtraFoodInfo = await response.json();

    const servingSizes = queryResults.foods[0].alt_measures
    
    return servingSizes
    }