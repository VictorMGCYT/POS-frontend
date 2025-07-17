

export interface UserDataInterface {
    username: string;
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    password: string;
    confirmPassword: string;
    role: "user" | "admin";
}

export interface UserData {
    id:              string;
    username:        string;
    firstName:       string;
    paternalSurname: string;
    maternalSurname: string;
    role:            "user" | "admin";
    createdAt:       Date;
    deletedAt:       null;
}