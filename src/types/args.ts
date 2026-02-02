export interface RegisterUserArgs{
    input:{
        name:string;
        email:string;
        password:string
        role:string

    };
}

export interface LoginUser{
    input:{
        email:string
        password:string
    }
}