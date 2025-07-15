export interface DepenseData{
    montant : number;
    description : string;
    date:Date;
    categoryName : string;
    categoryColor ?: string;
    tags ?: string;
}

export interface EditDepenseData extends DepenseData{
    _id:string;
}

export type GetListDepenseData = EditDepenseData[]

