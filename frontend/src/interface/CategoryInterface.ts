export interface CategoryData {
  categoryName : string;
  color : string
}

export interface CategoryDataWithId extends CategoryData{
  _id:string;
}


export type GetListCategoryData = CategoryDataWithId[]


