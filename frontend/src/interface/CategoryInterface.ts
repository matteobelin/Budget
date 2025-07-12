export interface CategoryData {
  categoryName : string;
  color : string
}

export interface EditCategoryData extends CategoryData{
  _id:string;
}


export type GetListCategoryData = EditCategoryData[]


