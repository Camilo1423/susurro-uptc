import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BlackListAccessTokenModel = runtime.Types.Result.DefaultSelection<Prisma.$BlackListAccessTokenPayload>;
export type AggregateBlackListAccessToken = {
    _count: BlackListAccessTokenCountAggregateOutputType | null;
    _min: BlackListAccessTokenMinAggregateOutputType | null;
    _max: BlackListAccessTokenMaxAggregateOutputType | null;
};
export type BlackListAccessTokenMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    jti: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type BlackListAccessTokenMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    jti: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
};
export type BlackListAccessTokenCountAggregateOutputType = {
    id: number;
    userId: number;
    jti: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
};
export type BlackListAccessTokenMinAggregateInputType = {
    id?: true;
    userId?: true;
    jti?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type BlackListAccessTokenMaxAggregateInputType = {
    id?: true;
    userId?: true;
    jti?: true;
    expiresAt?: true;
    createdAt?: true;
};
export type BlackListAccessTokenCountAggregateInputType = {
    id?: true;
    userId?: true;
    jti?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
};
export type BlackListAccessTokenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlackListAccessTokenWhereInput;
    orderBy?: Prisma.BlackListAccessTokenOrderByWithRelationInput | Prisma.BlackListAccessTokenOrderByWithRelationInput[];
    cursor?: Prisma.BlackListAccessTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BlackListAccessTokenCountAggregateInputType;
    _min?: BlackListAccessTokenMinAggregateInputType;
    _max?: BlackListAccessTokenMaxAggregateInputType;
};
export type GetBlackListAccessTokenAggregateType<T extends BlackListAccessTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateBlackListAccessToken]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBlackListAccessToken[P]> : Prisma.GetScalarType<T[P], AggregateBlackListAccessToken[P]>;
};
export type BlackListAccessTokenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlackListAccessTokenWhereInput;
    orderBy?: Prisma.BlackListAccessTokenOrderByWithAggregationInput | Prisma.BlackListAccessTokenOrderByWithAggregationInput[];
    by: Prisma.BlackListAccessTokenScalarFieldEnum[] | Prisma.BlackListAccessTokenScalarFieldEnum;
    having?: Prisma.BlackListAccessTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BlackListAccessTokenCountAggregateInputType | true;
    _min?: BlackListAccessTokenMinAggregateInputType;
    _max?: BlackListAccessTokenMaxAggregateInputType;
};
export type BlackListAccessTokenGroupByOutputType = {
    id: string;
    userId: string;
    jti: string;
    expiresAt: Date;
    createdAt: Date;
    _count: BlackListAccessTokenCountAggregateOutputType | null;
    _min: BlackListAccessTokenMinAggregateOutputType | null;
    _max: BlackListAccessTokenMaxAggregateOutputType | null;
};
export type GetBlackListAccessTokenGroupByPayload<T extends BlackListAccessTokenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BlackListAccessTokenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BlackListAccessTokenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BlackListAccessTokenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BlackListAccessTokenGroupByOutputType[P]>;
}>>;
export type BlackListAccessTokenWhereInput = {
    AND?: Prisma.BlackListAccessTokenWhereInput | Prisma.BlackListAccessTokenWhereInput[];
    OR?: Prisma.BlackListAccessTokenWhereInput[];
    NOT?: Prisma.BlackListAccessTokenWhereInput | Prisma.BlackListAccessTokenWhereInput[];
    id?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    userId?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    jti?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"BlackListAccessToken"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"BlackListAccessToken"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type BlackListAccessTokenOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    jti?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type BlackListAccessTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_jti?: Prisma.BlackListAccessTokenUserIdJtiCompoundUniqueInput;
    AND?: Prisma.BlackListAccessTokenWhereInput | Prisma.BlackListAccessTokenWhereInput[];
    OR?: Prisma.BlackListAccessTokenWhereInput[];
    NOT?: Prisma.BlackListAccessTokenWhereInput | Prisma.BlackListAccessTokenWhereInput[];
    userId?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    jti?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"BlackListAccessToken"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"BlackListAccessToken"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "id" | "userId_jti">;
export type BlackListAccessTokenOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    jti?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BlackListAccessTokenCountOrderByAggregateInput;
    _max?: Prisma.BlackListAccessTokenMaxOrderByAggregateInput;
    _min?: Prisma.BlackListAccessTokenMinOrderByAggregateInput;
};
export type BlackListAccessTokenScalarWhereWithAggregatesInput = {
    AND?: Prisma.BlackListAccessTokenScalarWhereWithAggregatesInput | Prisma.BlackListAccessTokenScalarWhereWithAggregatesInput[];
    OR?: Prisma.BlackListAccessTokenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BlackListAccessTokenScalarWhereWithAggregatesInput | Prisma.BlackListAccessTokenScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"BlackListAccessToken"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"BlackListAccessToken"> | string;
    jti?: Prisma.UuidWithAggregatesFilter<"BlackListAccessToken"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"BlackListAccessToken"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BlackListAccessToken"> | Date | string;
};
export type BlackListAccessTokenCreateInput = {
    id?: string;
    jti: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutBlackListAccessTokensInput;
};
export type BlackListAccessTokenUncheckedCreateInput = {
    id?: string;
    userId: string;
    jti: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BlackListAccessTokenUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutBlackListAccessTokensNestedInput;
};
export type BlackListAccessTokenUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlackListAccessTokenCreateManyInput = {
    id?: string;
    userId: string;
    jti: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BlackListAccessTokenUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlackListAccessTokenUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlackListAccessTokenListRelationFilter = {
    every?: Prisma.BlackListAccessTokenWhereInput;
    some?: Prisma.BlackListAccessTokenWhereInput;
    none?: Prisma.BlackListAccessTokenWhereInput;
};
export type BlackListAccessTokenOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BlackListAccessTokenUserIdJtiCompoundUniqueInput = {
    userId: string;
    jti: string;
};
export type BlackListAccessTokenCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    jti?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlackListAccessTokenMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    jti?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlackListAccessTokenMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    jti?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BlackListAccessTokenCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BlackListAccessTokenCreateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput> | Prisma.BlackListAccessTokenCreateWithoutUserInput[] | Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput | Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BlackListAccessTokenCreateManyUserInputEnvelope;
    connect?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
};
export type BlackListAccessTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BlackListAccessTokenCreateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput> | Prisma.BlackListAccessTokenCreateWithoutUserInput[] | Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput | Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BlackListAccessTokenCreateManyUserInputEnvelope;
    connect?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
};
export type BlackListAccessTokenUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BlackListAccessTokenCreateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput> | Prisma.BlackListAccessTokenCreateWithoutUserInput[] | Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput | Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BlackListAccessTokenUpsertWithWhereUniqueWithoutUserInput | Prisma.BlackListAccessTokenUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BlackListAccessTokenCreateManyUserInputEnvelope;
    set?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    disconnect?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    delete?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    connect?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    update?: Prisma.BlackListAccessTokenUpdateWithWhereUniqueWithoutUserInput | Prisma.BlackListAccessTokenUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BlackListAccessTokenUpdateManyWithWhereWithoutUserInput | Prisma.BlackListAccessTokenUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BlackListAccessTokenScalarWhereInput | Prisma.BlackListAccessTokenScalarWhereInput[];
};
export type BlackListAccessTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BlackListAccessTokenCreateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput> | Prisma.BlackListAccessTokenCreateWithoutUserInput[] | Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput | Prisma.BlackListAccessTokenCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BlackListAccessTokenUpsertWithWhereUniqueWithoutUserInput | Prisma.BlackListAccessTokenUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BlackListAccessTokenCreateManyUserInputEnvelope;
    set?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    disconnect?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    delete?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    connect?: Prisma.BlackListAccessTokenWhereUniqueInput | Prisma.BlackListAccessTokenWhereUniqueInput[];
    update?: Prisma.BlackListAccessTokenUpdateWithWhereUniqueWithoutUserInput | Prisma.BlackListAccessTokenUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BlackListAccessTokenUpdateManyWithWhereWithoutUserInput | Prisma.BlackListAccessTokenUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BlackListAccessTokenScalarWhereInput | Prisma.BlackListAccessTokenScalarWhereInput[];
};
export type BlackListAccessTokenCreateWithoutUserInput = {
    id?: string;
    jti: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BlackListAccessTokenUncheckedCreateWithoutUserInput = {
    id?: string;
    jti: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BlackListAccessTokenCreateOrConnectWithoutUserInput = {
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlackListAccessTokenCreateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput>;
};
export type BlackListAccessTokenCreateManyUserInputEnvelope = {
    data: Prisma.BlackListAccessTokenCreateManyUserInput | Prisma.BlackListAccessTokenCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type BlackListAccessTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
    update: Prisma.XOR<Prisma.BlackListAccessTokenUpdateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.BlackListAccessTokenCreateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedCreateWithoutUserInput>;
};
export type BlackListAccessTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
    data: Prisma.XOR<Prisma.BlackListAccessTokenUpdateWithoutUserInput, Prisma.BlackListAccessTokenUncheckedUpdateWithoutUserInput>;
};
export type BlackListAccessTokenUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.BlackListAccessTokenScalarWhereInput;
    data: Prisma.XOR<Prisma.BlackListAccessTokenUpdateManyMutationInput, Prisma.BlackListAccessTokenUncheckedUpdateManyWithoutUserInput>;
};
export type BlackListAccessTokenScalarWhereInput = {
    AND?: Prisma.BlackListAccessTokenScalarWhereInput | Prisma.BlackListAccessTokenScalarWhereInput[];
    OR?: Prisma.BlackListAccessTokenScalarWhereInput[];
    NOT?: Prisma.BlackListAccessTokenScalarWhereInput | Prisma.BlackListAccessTokenScalarWhereInput[];
    id?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    userId?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    jti?: Prisma.UuidFilter<"BlackListAccessToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"BlackListAccessToken"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"BlackListAccessToken"> | Date | string;
};
export type BlackListAccessTokenCreateManyUserInput = {
    id?: string;
    jti: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
};
export type BlackListAccessTokenUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlackListAccessTokenUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlackListAccessTokenUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    jti?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BlackListAccessTokenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    jti?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blackListAccessToken"]>;
export type BlackListAccessTokenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    jti?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blackListAccessToken"]>;
export type BlackListAccessTokenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    jti?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blackListAccessToken"]>;
export type BlackListAccessTokenSelectScalar = {
    id?: boolean;
    userId?: boolean;
    jti?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
};
export type BlackListAccessTokenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "jti" | "expiresAt" | "createdAt", ExtArgs["result"]["blackListAccessToken"]>;
export type BlackListAccessTokenInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BlackListAccessTokenIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BlackListAccessTokenIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $BlackListAccessTokenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BlackListAccessToken";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        jti: string;
        expiresAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["blackListAccessToken"]>;
    composites: {};
};
export type BlackListAccessTokenGetPayload<S extends boolean | null | undefined | BlackListAccessTokenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload, S>;
export type BlackListAccessTokenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BlackListAccessTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BlackListAccessTokenCountAggregateInputType | true;
};
export interface BlackListAccessTokenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BlackListAccessToken'];
        meta: {
            name: 'BlackListAccessToken';
        };
    };
    findUnique<T extends BlackListAccessTokenFindUniqueArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BlackListAccessTokenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BlackListAccessTokenFindFirstArgs>(args?: Prisma.SelectSubset<T, BlackListAccessTokenFindFirstArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BlackListAccessTokenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BlackListAccessTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BlackListAccessTokenFindManyArgs>(args?: Prisma.SelectSubset<T, BlackListAccessTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BlackListAccessTokenCreateArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenCreateArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BlackListAccessTokenCreateManyArgs>(args?: Prisma.SelectSubset<T, BlackListAccessTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BlackListAccessTokenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BlackListAccessTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BlackListAccessTokenDeleteArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenDeleteArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BlackListAccessTokenUpdateArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenUpdateArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BlackListAccessTokenDeleteManyArgs>(args?: Prisma.SelectSubset<T, BlackListAccessTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BlackListAccessTokenUpdateManyArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BlackListAccessTokenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BlackListAccessTokenUpsertArgs>(args: Prisma.SelectSubset<T, BlackListAccessTokenUpsertArgs<ExtArgs>>): Prisma.Prisma__BlackListAccessTokenClient<runtime.Types.Result.GetResult<Prisma.$BlackListAccessTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BlackListAccessTokenCountArgs>(args?: Prisma.Subset<T, BlackListAccessTokenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BlackListAccessTokenCountAggregateOutputType> : number>;
    aggregate<T extends BlackListAccessTokenAggregateArgs>(args: Prisma.Subset<T, BlackListAccessTokenAggregateArgs>): Prisma.PrismaPromise<GetBlackListAccessTokenAggregateType<T>>;
    groupBy<T extends BlackListAccessTokenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BlackListAccessTokenGroupByArgs['orderBy'];
    } : {
        orderBy?: BlackListAccessTokenGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BlackListAccessTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlackListAccessTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BlackListAccessTokenFieldRefs;
}
export interface Prisma__BlackListAccessTokenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BlackListAccessTokenFieldRefs {
    readonly id: Prisma.FieldRef<"BlackListAccessToken", 'String'>;
    readonly userId: Prisma.FieldRef<"BlackListAccessToken", 'String'>;
    readonly jti: Prisma.FieldRef<"BlackListAccessToken", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"BlackListAccessToken", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"BlackListAccessToken", 'DateTime'>;
}
export type BlackListAccessTokenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
};
export type BlackListAccessTokenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
};
export type BlackListAccessTokenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    where?: Prisma.BlackListAccessTokenWhereInput;
    orderBy?: Prisma.BlackListAccessTokenOrderByWithRelationInput | Prisma.BlackListAccessTokenOrderByWithRelationInput[];
    cursor?: Prisma.BlackListAccessTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlackListAccessTokenScalarFieldEnum | Prisma.BlackListAccessTokenScalarFieldEnum[];
};
export type BlackListAccessTokenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    where?: Prisma.BlackListAccessTokenWhereInput;
    orderBy?: Prisma.BlackListAccessTokenOrderByWithRelationInput | Prisma.BlackListAccessTokenOrderByWithRelationInput[];
    cursor?: Prisma.BlackListAccessTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlackListAccessTokenScalarFieldEnum | Prisma.BlackListAccessTokenScalarFieldEnum[];
};
export type BlackListAccessTokenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    where?: Prisma.BlackListAccessTokenWhereInput;
    orderBy?: Prisma.BlackListAccessTokenOrderByWithRelationInput | Prisma.BlackListAccessTokenOrderByWithRelationInput[];
    cursor?: Prisma.BlackListAccessTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlackListAccessTokenScalarFieldEnum | Prisma.BlackListAccessTokenScalarFieldEnum[];
};
export type BlackListAccessTokenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlackListAccessTokenCreateInput, Prisma.BlackListAccessTokenUncheckedCreateInput>;
};
export type BlackListAccessTokenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BlackListAccessTokenCreateManyInput | Prisma.BlackListAccessTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BlackListAccessTokenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    data: Prisma.BlackListAccessTokenCreateManyInput | Prisma.BlackListAccessTokenCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BlackListAccessTokenIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BlackListAccessTokenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlackListAccessTokenUpdateInput, Prisma.BlackListAccessTokenUncheckedUpdateInput>;
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
};
export type BlackListAccessTokenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BlackListAccessTokenUpdateManyMutationInput, Prisma.BlackListAccessTokenUncheckedUpdateManyInput>;
    where?: Prisma.BlackListAccessTokenWhereInput;
    limit?: number;
};
export type BlackListAccessTokenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BlackListAccessTokenUpdateManyMutationInput, Prisma.BlackListAccessTokenUncheckedUpdateManyInput>;
    where?: Prisma.BlackListAccessTokenWhereInput;
    limit?: number;
    include?: Prisma.BlackListAccessTokenIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BlackListAccessTokenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.BlackListAccessTokenCreateInput, Prisma.BlackListAccessTokenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BlackListAccessTokenUpdateInput, Prisma.BlackListAccessTokenUncheckedUpdateInput>;
};
export type BlackListAccessTokenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
    where: Prisma.BlackListAccessTokenWhereUniqueInput;
};
export type BlackListAccessTokenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BlackListAccessTokenWhereInput;
    limit?: number;
};
export type BlackListAccessTokenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BlackListAccessTokenSelect<ExtArgs> | null;
    omit?: Prisma.BlackListAccessTokenOmit<ExtArgs> | null;
    include?: Prisma.BlackListAccessTokenInclude<ExtArgs> | null;
};
