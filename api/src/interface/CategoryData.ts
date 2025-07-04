
export interface CategoryData{
    categoryName : string;
    color : string;
}

export interface GetCategoryResponse extends CategoryData{
    _id:string
}

export interface CategoryError{
    message:string;
}



export type GetListCategoryResponse = GetCategoryResponse[]