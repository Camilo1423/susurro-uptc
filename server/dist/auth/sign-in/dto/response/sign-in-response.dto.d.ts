export declare class SignInDto {
    id: string;
    email: string;
    username: string;
    firstName: string;
    secondName: string | null;
    firstLastName: string;
    secondLastName: string | null;
    documentTypeCode: string;
    documentType: string;
    documentNumber: string;
    pin: string;
    status: string;
    requireChangePassword: boolean;
    avatar: {
        thumbnail: string | null;
        original: string | null;
    };
}
