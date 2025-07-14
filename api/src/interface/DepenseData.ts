export interface DepenseData{
    montant : number;
    description : string;
    date:Date;
    categoryName:string;
    tags?:string;
}

export interface GetDepenseResponse extends DepenseData{
    _id:string
    categoryColor:string
}

export interface DepenseDataError{
    message:string
}

export type GetListDepenseResponse = GetDepenseResponse[] 