import type { User } from '../generated/prisma/client.js';
import { AvatarType } from '../generated/prisma/enums.js';
import { UserBase } from './interfaces/sign-in.interface.js';
type AvatarRow = {
    type: AvatarType;
    url: string;
};
export type UserWithSessionRelations = User & {
    documentType: {
        code: string;
        name: string;
    };
    avatars: AvatarRow[];
};
export declare function toUserSession(user: UserWithSessionRelations): UserBase;
export {};
