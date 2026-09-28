export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly SUSPENDED: "SUSPENDED";
    readonly PENDING: "PENDING";
    readonly DELETED: "DELETED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const AvatarType: {
    readonly THUMBNAIL: "THUMBNAIL";
    readonly ORIGINAL: "ORIGINAL";
};
export type AvatarType = (typeof AvatarType)[keyof typeof AvatarType];
