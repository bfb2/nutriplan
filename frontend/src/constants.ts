import { TrackedNutrients, Nutrients } from "./types/types";

const nutrientIds = new Map<number,Nutrients>();
nutrientIds.set(208,'energy')
nutrientIds.set(262, 'caffeine')
nutrientIds.set(511, 'alcohol')
nutrientIds.set(255, 'water')
nutrientIds.set(205,'carbohydrates')
nutrientIds.set(291,'fiber')
nutrientIds.set(209,'starch')
nutrientIds.set(269,"sugars")
nutrientIds.set(539,'added sugar')
nutrientIds.set(204,'fat')
nutrientIds.set(645,"monounsaturated")
nutrientIds.set(646,'polyunsaturated')
/* nutrientIds.set(,'Omega-3')
nutrientIds.set(,'Omega-6') */
nutrientIds.set(606,'saturated')
nutrientIds.set(605,'trans fats')
nutrientIds.set(601,'cholesterol')
nutrientIds.set(203,'protein')
nutrientIds.set(507,'cystine')
nutrientIds.set(512,'histidine')
nutrientIds.set(503,'isoleucine')
nutrientIds.set(504,'leucine')
nutrientIds.set(505,'lysine')
nutrientIds.set(506,'methionine')
nutrientIds.set(508,'phenylalanine')
nutrientIds.set(502,'threonine')
nutrientIds.set(501,'tryptophan')
nutrientIds.set(509,'tyrosine')
nutrientIds.set(510,'valine')
nutrientIds.set(404,'thiamine')
nutrientIds.set(405,'riboflavin')
nutrientIds.set(406,'niacin')
nutrientIds.set(410,'pantothenic acid')
nutrientIds.set(415,'pyridoxine')
nutrientIds.set(418,'cobalamin')
nutrientIds.set(417,'folate')
nutrientIds.set(320,'vitamin a')
nutrientIds.set(401,'vitamin c')
nutrientIds.set(324,'vitamin d')
nutrientIds.set(323,'vitamin e')
nutrientIds.set(430,'vitamin k')
nutrientIds.set(301,'calcium')
nutrientIds.set(312,'copper')
nutrientIds.set(303,'iron')
nutrientIds.set(304,'magnesium')
nutrientIds.set(315,'manganese')
nutrientIds.set(305,'phosphorus')
nutrientIds.set(306,'potassium')
nutrientIds.set(317,'selenium')
nutrientIds.set(307,'sodium')
nutrientIds.set(309,'zinc')
nutrientIds.set(421, 'choline')




export const nutrientTables = new Map<Nutrients ,keyof TrackedNutrients>([
    ['energy','general'],
[ 'caffeine','general'],
['alcohol','general'],
[ 'water','general'],
['carbohydrates','carbohydrates'],
['fiber','carbohydrates'],
['starch','carbohydrates'],
["sugars",'carbohydrates'],
['added sugar','carbohydrates'],
['fat','fat'],
["monounsaturated",'fat'],
['polyunsaturated','fat'],
['saturated','fat'],
['trans fats','fat'],
['cholesterol','fat'],
['protein','protein'],
['cystine','protein'],
['histidine','protein'],
['isoleucine','protein'],
['leucine','protein'],
['lysine','protein'],
['methionine','protein'],
['phenylalanine','protein'],
['threonine','protein'],
['tryptophan','protein'],
['tyrosine','protein'],
['valine','protein'],
['thiamine','vitamins'],
['riboflavin','vitamins'],
['niacin','vitamins'],
['pantothenic acid','vitamins'],
['pyridoxine','vitamins'],
['cobalamin','vitamins'],
['folate','vitamins'],
['vitamin a','vitamins'],
['vitamin c','vitamins'],
['vitamin d','vitamins'],
['vitamin e','vitamins'],
['vitamin k','vitamins'],
['calcium','minerals'],
['copper','minerals'],
['iron','minerals'],
['magnesium','minerals'],
['manganese','minerals'],
['phosphorus','minerals'],
['potassium','minerals'],
['selenium','minerals'],
['sodium','minerals'],
['zinc','minerals'],
['choline','vitamins']
])

export const protein ={
    protein:{
        name:'Protein',
        measureLabel:'g',
    },
    cystine:{
        name:' Cystine',
        measureLabel:'g',
    },
    histidine:{
        name:' Histidine',
        measureLabel:'g',
    },
    isoleucine:{
        name:' Isoleucine',
        measureLabel:'g',
    },
    leucine:{
        name:' Leucine',
        measureLabel:'g',
    },
    lysine:{
        name:' Lysine',
        measureLabel:'g',
    },
    methionine:{
        name:' Methionine',
        measureLabel:'g',
    },
    phenylalanine:{
        name:" Phenylalanine",
        measureLabel:'g',
    },
    threonine:{
        name:' Threonine',
        measureLabel:'g',
    },
    tryptophan:{
        name:' Tryptophan',
        measureLabel:'g',
    },
    tyrosine:{
        name:" Tyrosine",
        measureLabel:"g",
        
    },
    valine:{
        name:' Valine',
        measureLabel:"g",
        
    }
}

export const general={
    energy:{
        name:'Energy',
        measureLabel:'cal',
    },
    alcohol:{
        name:'Alcohol',
        measureLabel:'g',
    },
    caffeine:{
        name:'Caffeine',
        measureLabel:'mg',
    },
    water:{
        name:'Water',
        measureLabel:'l',
    }
}

export const fat ={
    fat:{
        name:'Fat',
        measureLabel:'g',
    },
    monounsaturated:{
        name:"MonoUnsaturated",
        measureLabel:'g',
    },
    polyunsaturated:{
        name:'PolyUnsaturated',
        measureLabel:'g',
    },
    saturated:{
        name:'Saturated',
        measureLabel:'g',
    },
    'trans fats':{
        name:'Trans-Fats',
        measureLabel:"g"
    },
    cholesterol:{
        name:'Cholesterol',
        measureLabel:'mg',
    }
}

export const carbs={
    carbohydrates:{
        name:'Carbohydrates',
        measureLabel:'g',
    },
    fiber:{
        name:'Fiber',
        measureLabel:'g',
    },
    starch:{
        name:'Starch',
        measureLabel:'g',
    },
    'added sugar':{
        name:'Added Sugar',
        measureLabel:'g',
    },
    sugars:{
        name:'Sugars',
        measureLabel:'g',
    }

}

export const minerals ={
    calcium:{
        name:'Calcium',
        measureLabel:'mg',
    },
    copper:{
        name:'Copper',
        measureLabel:'mg',
    },
    iron:{
        name:'Iron',
        measureLabel:'mg',
    },
    magnesium:{
        name:'Magnesium',
        measureLabel:'mg',
    },
    manganese:{
        name:"Manganese",
        measureLabel:'mg',
    },
    phosphorus:{
        name:'Phosphorus',
        measureLabel:'mg',
    },
    potassium:{
        name:'Potassium',
        measureLabel:'mg',
    },
    selenium:{
        name:"Selenium",
        measureLabel:'µg',
    },
    sodium:{
        name:"Sodium",
        measureLabel:'mg',
    },
    zinc:{
        name:'Zinc',
        measureLabel:'mg',
    },
    chromium:{
        name:'Chromium',
        measureLabel:'µg',
    }
}

export const vitamins ={
    thiamine:{
        name:"B1 (Thiamine)",
        measureLabel:"mg", 
    },
    riboflavin:{
        name:'B2 (Riboflavin)',
        measureLabel:'mg', 
    },
    niacin:{
        name:'B3 (Niacin)',
        measureLabel:"mg",
    },
    'pantothenic acid':{
        name:'B5 (Pantothenic Acid)',
        measureLabel:'mg', 
    },
    pyridoxine:{
        name:'B6 (Pyridoxine)',
        measureLabel:'mg',
    },
    cobalamin:{
        name:'B12 (Cobalamin)',
        measureLabel:'µg',
    },
    choline:{
        name:"Choline",
        measureLabel:'mg',
    },
    folate:{
        name:'Folate',
        measureLabel:'µg',
    },
    'vitamin a':{
        name:'Vitamin A',
        measureLabel:'µg',
    },
    'vitamin c':{
        name:"Vitamin C",
        measureLabel:'mg',
    },
    'vitamin d':{
        name:'Vitamin D',
        measureLabel:'IU',
    },
    'vitamin e':{
        name:'Vitamin E',
        measureLabel:'mg',
    },
    'vitamin k':{
        name:"Vitamin K",
        measureLabel:'µg',
    }
}

export const rda:Record<Nutrients, number|'N/D'> = {
    energy:2000,
    calcium:1000,
    chromium:35,
    copper:900,
    iron:8,
    magnesium:400,
    manganese:2.3,
    phosphorus:700,
    selenium:55,
    zinc:11,
    potassium:3400,
    sodium:1500,
    'vitamin a':900,
    'vitamin c':90,
    'vitamin d':600,
    'vitamin e':15,
    'vitamin k':120,
    thiamine:1.2,
    riboflavin:1.3,
    niacin:16,
    pyridoxine:1.3,
    folate:400,
    cobalamin:2.4,
    'pantothenic acid':5,
    choline:550,
    water:3700, //liters
    fiber:38,
    protein:56,
    alcohol:'N/D',
    caffeine:'N/D',
    starch:'N/D',
    sugars:'N/D',
    'added sugar':'N/D',
    monounsaturated:'N/D',
    polyunsaturated:'N/D',
    saturated:22,
    'trans fats':'N/D',
    cystine:'N/D',
    histidine:'N/D',
    isoleucine:'N/D',
    leucine:'N/D',
    lysine:'N/D',
    methionine:'N/D',
    phenylalanine:'N/D',
    threonine:'N/D',
    tryptophan:'N/D',
    tyrosine:'N/D',
    valine:'N/D', 
    cholesterol:300,
    carbohydrates:'N/D',
    fat:'N/D'
}

export const dashboardItems:Record<Nutrients, boolean> = {
    energy:true,
    calcium:false,
    chromium:false,
    copper:false,
    iron:false,
    magnesium:false,
    manganese:false,
    phosphorus:false,
    selenium:false,
    zinc:false,
    potassium:false,
    sodium:false,
    'vitamin a':false,
    'vitamin c':false,
    'vitamin d':false,
    'vitamin e':false,
    'vitamin k':false,
    thiamine:false,
    riboflavin:false,
    niacin:false,
    pyridoxine:false,
    folate:false,
    cobalamin:false,
    'pantothenic acid':false,
    choline:false,
    water:false, //liters
    fiber:false,
    protein:true,
    alcohol:false,
    caffeine:false,
    starch:false,
    sugars:false,
    'added sugar':false,
    monounsaturated:false,
    polyunsaturated:false,
    saturated:false,
    'trans fats':false,
    cystine:false,
    histidine:false,
    isoleucine:false,
    leucine:false,
    lysine:false,
    methionine:false,
    phenylalanine:false,
    threonine:false,
    tryptophan:false,
    tyrosine:false,
    valine:false, 
    cholesterol:false,
    carbohydrates:true,
    fat:true
}

export const nutrientsNameAndLabel = {
    general, 
    protein, 
    carbohydrates:carbs,
    fat,
    minerals,
    vitamins
}

export default nutrientIds