// Interface and properties to be made optional
export type MakePropRequired<T, K extends string,> = 
K extends`${infer Property}.${infer Rest}`
    ? Property extends keyof T
        ? T[Property] extends object
            ? MakePropRequired<T[Property], Rest>
            : MakePropRequired<Omit<T, Property> & Pick<{[P in keyof T]-?:T[P]}, Property>, Rest> 
        :T   
    : K extends `${infer Property}, ${infer Rest}`
        ? Property extends keyof T
            ? MakePropRequired<Omit<T, Property> & Pick<{[P in keyof T]-?:T[P]}, Property>, Rest> 
            : never
        : K extends keyof T
            ? Omit<T, K> & Pick<{[P in keyof T]-?:T[P]}, K >
            : never





    /*
        type MakePropRequired<T, K extends string, O> = 
    K extends`${infer Property}.${infer Rest}`
        ? Property extends keyof T
            ? T[Property] extends object
                ? MakePropRequired<T[Property], Rest, O>
                : MakePropRequired<Omit<T, Property> & Pick<{[P in keyof T]?:T[P]}, Property>, Rest, O> 
            :T   
        : K extends `${infer Property}, ${infer Rest}`
            ? Property extends keyof T
                ? MakePropRequired<Omit<T, Property> & Pick<{[P in keyof T]?:T[P]}, Property>, Rest, O> 
                : never
            : K extends keyof T
                ? Omit<T, K> & Pick<{[P in keyof T]?:T[P]}, K >
                : never
    */