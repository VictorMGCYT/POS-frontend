

export interface UserDataInterface {
    username: string;
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    password: string;
    confirmPassword: string;
    role: "user" | "admin";
}