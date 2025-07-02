export interface LoginData {
  email : string;
  password : string
}

export interface LoginDataError{
    message:string;
}

export interface LoginDataResponse{
    firstname:string;
    lastname:string
}