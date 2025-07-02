export interface SignUpData {
    firstname:string;
    lastname:string
    email : string;
    password : string;
    confirmPassword : string
}

export interface SignUpDataError{
    message:string
}

export interface SignUpDataResponse{
    firstname:string;
    lastname:string
}