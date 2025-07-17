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

export interface DepenseStatistic{
    amount : number;
    categoryName : string;
    categoryColor : string
}

export interface DepenseStatisticByMonth{
    month: string;
    statistics: DepenseStatistic[];
    amountTotal :number;
}

export interface DepenseStatisticByYear{
    year:string;
    statistics: DepenseStatisticByMonth[],
    amountTotalByYear:number
}

export type DepenseStatisticTotal = DepenseStatisticByYear[]