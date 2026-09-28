import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserAvatarModel = runtime.Types.Result.DefaultSelection<Prisma.$UserAvatarPayload>;
export type AggregateUserAvatar = {
    _count: UserAvatarCountAggregateOutputType | null;
    _min: UserAvatarMinAggregateOutputType | null;
    _max: UserAvatarMaxAggregateOutputType | null;
};
export type UserAvatarMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: $Enums.AvatarType | null;
    key: string | null;
    url: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserAvatarMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: $Enums.AvatarType | null;
    key: string | null;
    url: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserAvatarCountAggregateOutputType = {
    id: number;
    userId: number;
    type: number;
    key: number;
    url: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserAvatarMinAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    key?: true;
    url?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserAvatarMaxAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    key?: true;
    url?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserAvatarCountAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    key?: true;
    url?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAvatarAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserAvatarWhereInput;
    orderBy?: Prisma.UserAvatarOrderByWithRelationInput | Prisma.UserAvatarOrderByWithRelationInput[];
    cursor?: Prisma.UserAvatarWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserAvatarCountAggregateInputType;
    _min?: UserAvatarMinAggregateInputType;
    _max?: UserAvatarMaxAggregateInputType;
};
export type GetUserAvatarAggregateType<T extends UserAvatarAggregateArgs> = {
    [P in keyof T & keyof AggregateUserAvatar]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserAvatar[P]> : Prisma.GetScalarType<T[P], AggregateUserAvatar[P]>;
};
export type UserAvatarGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserAvatarWhereInput;
    orderBy?: Prisma.UserAvatarOrderByWithAggregationInput | Prisma.UserAvatarOrderByWithAggregationInput[];
    by: Prisma.UserAvatarScalarFieldEnum[] | Prisma.UserAvatarScalarFieldEnum;
    having?: Prisma.UserAvatarScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserAvatarCountAggregateInputType | true;
    _min?: UserAvatarMinAggregateInputType;
    _max?: UserAvatarMaxAggregateInputType;
};
export type UserAvatarGroupByOutputType = {
    id: string;
    userId: string;
    type: $Enums.AvatarType;
    key: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    _count: UserAvatarCountAggregateOutputType | null;
    _min: UserAvatarMinAggregateOutputType | null;
    _max: UserAvatarMaxAggregateOutputType | null;
};
export type GetUserAvatarGroupByPayload<T extends UserAvatarGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserAvatarGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserAvatarGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserAvatarGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserAvatarGroupByOutputType[P]>;
}>>;
export type UserAvatarWhereInput = {
    AND?: Prisma.UserAvatarWhereInput | Prisma.UserAvatarWhereInput[];
    OR?: Prisma.UserAvatarWhereInput[];
    NOT?: Prisma.UserAvatarWhereInput | Prisma.UserAvatarWhereInput[];
    id?: Prisma.UuidFilter<"UserAvatar"> | string;
    userId?: Prisma.UuidFilter<"UserAvatar"> | string;
    type?: Prisma.EnumAvatarTypeFilter<"UserAvatar"> | $Enums.AvatarType;
    key?: Prisma.StringFilter<"UserAvatar"> | string;
    url?: Prisma.StringFilter<"UserAvatar"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserAvatar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserAvatar"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserAvatarOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type UserAvatarWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_type?: Prisma.UserAvatarUserIdTypeCompoundUniqueInput;
    AND?: Prisma.UserAvatarWhereInput | Prisma.UserAvatarWhereInput[];
    OR?: Prisma.UserAvatarWhereInput[];
    NOT?: Prisma.UserAvatarWhereInput | Prisma.UserAvatarWhereInput[];
    userId?: Prisma.UuidFilter<"UserAvatar"> | string;
    type?: Prisma.EnumAvatarTypeFilter<"UserAvatar"> | $Enums.AvatarType;
    key?: Prisma.StringFilter<"UserAvatar"> | string;
    url?: Prisma.StringFilter<"UserAvatar"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserAvatar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserAvatar"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "id" | "userId_type">;
export type UserAvatarOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserAvatarCountOrderByAggregateInput;
    _max?: Prisma.UserAvatarMaxOrderByAggregateInput;
    _min?: Prisma.UserAvatarMinOrderByAggregateInput;
};
export type UserAvatarScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserAvatarScalarWhereWithAggregatesInput | Prisma.UserAvatarScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserAvatarScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserAvatarScalarWhereWithAggregatesInput | Prisma.UserAvatarScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"UserAvatar"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"UserAvatar"> | string;
    type?: Prisma.EnumAvatarTypeWithAggregatesFilter<"UserAvatar"> | $Enums.AvatarType;
    key?: Prisma.StringWithAggregatesFilter<"UserAvatar"> | string;
    url?: Prisma.StringWithAggregatesFilter<"UserAvatar"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserAvatar"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"UserAvatar"> | Date | string;
};
export type UserAvatarCreateInput = {
    id?: string;
    type: $Enums.AvatarType;
    key: string;
    url: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutAvatarsInput;
};
export type UserAvatarUncheckedCreateInput = {
    id?: string;
    userId: string;
    type: $Enums.AvatarType;
    key: string;
    url: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserAvatarUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumAvatarTypeFieldUpdateOperationsInput | $Enums.AvatarType;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutAvatarsNestedInput;
};
export type UserAvatarUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumAvatarTypeFieldUpdateOperationsInput | $Enums.AvatarType;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserAvatarCreateManyInput = {
    id?: string;
    userId: string;
    type: $Enums.AvatarType;
    key: string;
    url: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserAvatarUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumAvatarTypeFieldUpdateOperationsInput | $Enums.AvatarType;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserAvatarUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumAvatarTypeFieldUpdateOperationsInput | $Enums.AvatarType;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserAvatarListRelationFilter = {
    every?: Prisma.UserAvatarWhereInput;
    some?: Prisma.UserAvatarWhereInput;
    none?: Prisma.UserAvatarWhereInput;
};
export type UserAvatarOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserAvatarUserIdTypeCompoundUniqueInput = {
    userId: string;
    type: $Enums.AvatarType;
};
export type UserAvatarCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserAvatarMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserAvatarMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserAvatarCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserAvatarCreateWithoutUserInput, Prisma.UserAvatarUncheckedCreateWithoutUserInput> | Prisma.UserAvatarCreateWithoutUserInput[] | Prisma.UserAvatarUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserAvatarCreateOrConnectWithoutUserInput | Prisma.UserAvatarCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserAvatarCreateManyUserInputEnvelope;
    connect?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
};
export type UserAvatarUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserAvatarCreateWithoutUserInput, Prisma.UserAvatarUncheckedCreateWithoutUserInput> | Prisma.UserAvatarCreateWithoutUserInput[] | Prisma.UserAvatarUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserAvatarCreateOrConnectWithoutUserInput | Prisma.UserAvatarCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserAvatarCreateManyUserInputEnvelope;
    connect?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
};
export type UserAvatarUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserAvatarCreateWithoutUserInput, Prisma.UserAvatarUncheckedCreateWithoutUserInput> | Prisma.UserAvatarCreateWithoutUserInput[] | Prisma.UserAvatarUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserAvatarCreateOrConnectWithoutUserInput | Prisma.UserAvatarCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserAvatarUpsertWithWhereUniqueWithoutUserInput | Prisma.UserAvatarUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserAvatarCreateManyUserInputEnvelope;
    set?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    disconnect?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    delete?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    connect?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    update?: Prisma.UserAvatarUpdateWithWhereUniqueWithoutUserInput | Prisma.UserAvatarUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserAvatarUpdateManyWithWhereWithoutUserInput | Prisma.UserAvatarUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserAvatarScalarWhereInput | Prisma.UserAvatarScalarWhereInput[];
};
export type UserAvatarUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserAvatarCreateWithoutUserInput, Prisma.UserAvatarUncheckedCreateWithoutUserInput> | Prisma.UserAvatarCreateWithoutUserInput[] | Prisma.UserAvatarUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserAvatarCreateOrConnectWithoutUserInput | Prisma.UserAvatarCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserAvatarUpsertWithWhereUniqueWithoutUserInput | Prisma.UserAvatarUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserAvatarCreateManyUserInputEnvelope;
    set?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    disconnect?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    delete?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    connect?: Prisma.UserAvatarWhereUniqueInput | Prisma.UserAvatarWhereUniqueInput[];
    update?: Prisma.UserAvatarUpdateWithWhereUniqueWithoutUserInput | Prisma.UserAvatarUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserAvatarUpdateManyWithWhereWithoutUserInput | Prisma.UserAvatarUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserAvatarScalarWhereInput | Prisma.UserAvatarScalarWhereInput[];
};
export type EnumAvatarTypeFieldUpdateOperationsInput = {
    set?: $Enums.AvatarType;
};
export type UserAvatarCreateWithoutUserInput = {
    id?: string;
    type: $Enums.AvatarType;
    key: string;
    url: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserAvatarUncheckedCreateWithoutUserInput = {
    id?: string;
    type: $Enums.AvatarType;
    key: string;
    url: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserAvatarCreateOrConnectWithoutUserInput = {
    where: Prisma.UserAvatarWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserAvatarCreateWithoutUserInput, Prisma.UserAvatarUncheckedCreateWithoutUserInput>;
};
export type UserAvatarCreateManyUserInputEnvelope = {
    data: Prisma.UserAvatarCreateManyUserInput | Prisma.UserAvatarCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserAvatarUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserAvatarWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserAvatarUpdateWithoutUserInput, Prisma.UserAvatarUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserAvatarCreateWithoutUserInput, Prisma.UserAvatarUncheckedCreateWithoutUserInput>;
};
export type UserAvatarUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserAvatarWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserAvatarUpdateWithoutUserInput, Prisma.UserAvatarUncheckedUpdateWithoutUserInput>;
};
export type UserAvatarUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserAvatarScalarWhereInput;
    data: Prisma.XOR<Prisma.UserAvatarUpdateManyMutationInput, Prisma.UserAvatarUncheckedUpdateManyWithoutUserInput>;
};
export type UserAvatarScalarWhereInput = {
    AND?: Prisma.UserAvatarScalarWhereInput | Prisma.UserAvatarScalarWhereInput[];
    OR?: Prisma.UserAvatarScalarWhereInput[];
    NOT?: Prisma.UserAvatarScalarWhereInput | Prisma.UserAvatarScalarWhereInput[];
    id?: Prisma.UuidFilter<"UserAvatar"> | string;
    userId?: Prisma.UuidFilter<"UserAvatar"> | string;
    type?: Prisma.EnumAvatarTypeFilter<"UserAvatar"> | $Enums.AvatarType;
    key?: Prisma.StringFilter<"UserAvatar"> | string;
    url?: Prisma.StringFilter<"UserAvatar"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserAvatar"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserAvatar"> | Date | string;
};
export type UserAvatarCreateManyUserInput = {
    id?: string;
    type: $Enums.AvatarType;
    key: string;
    url: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserAvatarUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumAvatarTypeFieldUpdateOperationsInput | $Enums.AvatarType;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserAvatarUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumAvatarTypeFieldUpdateOperationsInput | $Enums.AvatarType;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserAvatarUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumAvatarTypeFieldUpdateOperationsInput | $Enums.AvatarType;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserAvatarSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    key?: boolean;
    url?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userAvatar"]>;
export type UserAvatarSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    key?: boolean;
    url?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userAvatar"]>;
export type UserAvatarSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    key?: boolean;
    url?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userAvatar"]>;
export type UserAvatarSelectScalar = {
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    key?: boolean;
    url?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserAvatarOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "type" | "key" | "url" | "createdAt" | "updatedAt", ExtArgs["result"]["userAvatar"]>;
export type UserAvatarInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserAvatarIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserAvatarIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserAvatarPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserAvatar";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        type: $Enums.AvatarType;
        key: string;
        url: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["userAvatar"]>;
    composites: {};
};
export type UserAvatarGetPayload<S extends boolean | null | undefined | UserAvatarDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload, S>;
export type UserAvatarCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserAvatarFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserAvatarCountAggregateInputType | true;
};
export interface UserAvatarDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserAvatar'];
        meta: {
            name: 'UserAvatar';
        };
    };
    findUnique<T extends UserAvatarFindUniqueArgs>(args: Prisma.SelectSubset<T, UserAvatarFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserAvatarFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserAvatarFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserAvatarFindFirstArgs>(args?: Prisma.SelectSubset<T, UserAvatarFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserAvatarFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserAvatarFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserAvatarFindManyArgs>(args?: Prisma.SelectSubset<T, UserAvatarFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserAvatarCreateArgs>(args: Prisma.SelectSubset<T, UserAvatarCreateArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserAvatarCreateManyArgs>(args?: Prisma.SelectSubset<T, UserAvatarCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserAvatarCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserAvatarCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserAvatarDeleteArgs>(args: Prisma.SelectSubset<T, UserAvatarDeleteArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserAvatarUpdateArgs>(args: Prisma.SelectSubset<T, UserAvatarUpdateArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserAvatarDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserAvatarDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserAvatarUpdateManyArgs>(args: Prisma.SelectSubset<T, UserAvatarUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserAvatarUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserAvatarUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserAvatarUpsertArgs>(args: Prisma.SelectSubset<T, UserAvatarUpsertArgs<ExtArgs>>): Prisma.Prisma__UserAvatarClient<runtime.Types.Result.GetResult<Prisma.$UserAvatarPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserAvatarCountArgs>(args?: Prisma.Subset<T, UserAvatarCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserAvatarCountAggregateOutputType> : number>;
    aggregate<T extends UserAvatarAggregateArgs>(args: Prisma.Subset<T, UserAvatarAggregateArgs>): Prisma.PrismaPromise<GetUserAvatarAggregateType<T>>;
    groupBy<T extends UserAvatarGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserAvatarGroupByArgs['orderBy'];
    } : {
        orderBy?: UserAvatarGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserAvatarGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAvatarGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserAvatarFieldRefs;
}
export interface Prisma__UserAvatarClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserAvatarFieldRefs {
    readonly id: Prisma.FieldRef<"UserAvatar", 'String'>;
    readonly userId: Prisma.FieldRef<"UserAvatar", 'String'>;
    readonly type: Prisma.FieldRef<"UserAvatar", 'AvatarType'>;
    readonly key: Prisma.FieldRef<"UserAvatar", 'String'>;
    readonly url: Prisma.FieldRef<"UserAvatar", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserAvatar", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"UserAvatar", 'DateTime'>;
}
export type UserAvatarFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    where: Prisma.UserAvatarWhereUniqueInput;
};
export type UserAvatarFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    where: Prisma.UserAvatarWhereUniqueInput;
};
export type UserAvatarFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    where?: Prisma.UserAvatarWhereInput;
    orderBy?: Prisma.UserAvatarOrderByWithRelationInput | Prisma.UserAvatarOrderByWithRelationInput[];
    cursor?: Prisma.UserAvatarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserAvatarScalarFieldEnum | Prisma.UserAvatarScalarFieldEnum[];
};
export type UserAvatarFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    where?: Prisma.UserAvatarWhereInput;
    orderBy?: Prisma.UserAvatarOrderByWithRelationInput | Prisma.UserAvatarOrderByWithRelationInput[];
    cursor?: Prisma.UserAvatarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserAvatarScalarFieldEnum | Prisma.UserAvatarScalarFieldEnum[];
};
export type UserAvatarFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    where?: Prisma.UserAvatarWhereInput;
    orderBy?: Prisma.UserAvatarOrderByWithRelationInput | Prisma.UserAvatarOrderByWithRelationInput[];
    cursor?: Prisma.UserAvatarWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserAvatarScalarFieldEnum | Prisma.UserAvatarScalarFieldEnum[];
};
export type UserAvatarCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserAvatarCreateInput, Prisma.UserAvatarUncheckedCreateInput>;
};
export type UserAvatarCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserAvatarCreateManyInput | Prisma.UserAvatarCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserAvatarCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    data: Prisma.UserAvatarCreateManyInput | Prisma.UserAvatarCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserAvatarIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserAvatarUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserAvatarUpdateInput, Prisma.UserAvatarUncheckedUpdateInput>;
    where: Prisma.UserAvatarWhereUniqueInput;
};
export type UserAvatarUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserAvatarUpdateManyMutationInput, Prisma.UserAvatarUncheckedUpdateManyInput>;
    where?: Prisma.UserAvatarWhereInput;
    limit?: number;
};
export type UserAvatarUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserAvatarUpdateManyMutationInput, Prisma.UserAvatarUncheckedUpdateManyInput>;
    where?: Prisma.UserAvatarWhereInput;
    limit?: number;
    include?: Prisma.UserAvatarIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserAvatarUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    where: Prisma.UserAvatarWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserAvatarCreateInput, Prisma.UserAvatarUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserAvatarUpdateInput, Prisma.UserAvatarUncheckedUpdateInput>;
};
export type UserAvatarDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
    where: Prisma.UserAvatarWhereUniqueInput;
};
export type UserAvatarDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserAvatarWhereInput;
    limit?: number;
};
export type UserAvatarDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserAvatarSelect<ExtArgs> | null;
    omit?: Prisma.UserAvatarOmit<ExtArgs> | null;
    include?: Prisma.UserAvatarInclude<ExtArgs> | null;
};
