export interface DepenseData{
    montant : number;
    description : string;
    date:Date;
    categoryName:string;
    tags?:string;
}
export interface DepenseDataWithId extends DepenseData{
    _id:string
}

export interface GetDepenseResponse extends DepenseDataWithId{
    categoryColor:string
}


export interface DepenseDataError{
    message:string
}

export type GetListDepenseResponse = GetDepenseResponse[] 