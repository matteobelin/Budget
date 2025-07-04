export interface DepenseData{
    montant : number;
    description : string;
    date:Date;
    categoryName:string;
    tags?:string;
}

export interface DepenseDataError{
    message:string
}