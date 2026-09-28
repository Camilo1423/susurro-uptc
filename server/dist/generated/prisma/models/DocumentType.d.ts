import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DocumentTypeModel = runtime.Types.Result.DefaultSelection<Prisma.$DocumentTypePayload>;
export type AggregateDocumentType = {
    _count: DocumentTypeCountAggregateOutputType | null;
    _min: DocumentTypeMinAggregateOutputType | null;
    _max: DocumentTypeMaxAggregateOutputType | null;
};
export type DocumentTypeMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    code: string | null;
    description: string | null;
    status: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DocumentTypeMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    code: string | null;
    description: string | null;
    status: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DocumentTypeCountAggregateOutputType = {
    id: number;
    name: number;
    code: number;
    description: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DocumentTypeMinAggregateInputType = {
    id?: true;
    name?: true;
    code?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DocumentTypeMaxAggregateInputType = {
    id?: true;
    name?: true;
    code?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DocumentTypeCountAggregateInputType = {
    id?: true;
    name?: true;
    code?: true;
    description?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DocumentTypeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentTypeWhereInput;
    orderBy?: Prisma.DocumentTypeOrderByWithRelationInput | Prisma.DocumentTypeOrderByWithRelationInput[];
    cursor?: Prisma.DocumentTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocumentTypeCountAggregateInputType;
    _min?: DocumentTypeMinAggregateInputType;
    _max?: DocumentTypeMaxAggregateInputType;
};
export type GetDocumentTypeAggregateType<T extends DocumentTypeAggregateArgs> = {
    [P in keyof T & keyof AggregateDocumentType]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocumentType[P]> : Prisma.GetScalarType<T[P], AggregateDocumentType[P]>;
};
export type DocumentTypeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentTypeWhereInput;
    orderBy?: Prisma.DocumentTypeOrderByWithAggregationInput | Prisma.DocumentTypeOrderByWithAggregationInput[];
    by: Prisma.DocumentTypeScalarFieldEnum[] | Prisma.DocumentTypeScalarFieldEnum;
    having?: Prisma.DocumentTypeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocumentTypeCountAggregateInputType | true;
    _min?: DocumentTypeMinAggregateInputType;
    _max?: DocumentTypeMaxAggregateInputType;
};
export type DocumentTypeGroupByOutputType = {
    id: string;
    name: string;
    code: string;
    description: string | null;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: DocumentTypeCountAggregateOutputType | null;
    _min: DocumentTypeMinAggregateOutputType | null;
    _max: DocumentTypeMaxAggregateOutputType | null;
};
export type GetDocumentTypeGroupByPayload<T extends DocumentTypeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocumentTypeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocumentTypeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocumentTypeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocumentTypeGroupByOutputType[P]>;
}>>;
export type DocumentTypeWhereInput = {
    AND?: Prisma.DocumentTypeWhereInput | Prisma.DocumentTypeWhereInput[];
    OR?: Prisma.DocumentTypeWhereInput[];
    NOT?: Prisma.DocumentTypeWhereInput | Prisma.DocumentTypeWhereInput[];
    id?: Prisma.UuidFilter<"DocumentType"> | string;
    name?: Prisma.StringFilter<"DocumentType"> | string;
    code?: Prisma.StringFilter<"DocumentType"> | string;
    description?: Prisma.StringNullableFilter<"DocumentType"> | string | null;
    status?: Prisma.BoolFilter<"DocumentType"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"DocumentType"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocumentType"> | Date | string;
    users?: Prisma.UserListRelationFilter;
};
export type DocumentTypeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    users?: Prisma.UserOrderByRelationAggregateInput;
};
export type DocumentTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    code?: string;
    AND?: Prisma.DocumentTypeWhereInput | Prisma.DocumentTypeWhereInput[];
    OR?: Prisma.DocumentTypeWhereInput[];
    NOT?: Prisma.DocumentTypeWhereInput | Prisma.DocumentTypeWhereInput[];
    description?: Prisma.StringNullableFilter<"DocumentType"> | string | null;
    status?: Prisma.BoolFilter<"DocumentType"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"DocumentType"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocumentType"> | Date | string;
    users?: Prisma.UserListRelationFilter;
}, "id" | "id" | "name" | "code">;
export type DocumentTypeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DocumentTypeCountOrderByAggregateInput;
    _max?: Prisma.DocumentTypeMaxOrderByAggregateInput;
    _min?: Prisma.DocumentTypeMinOrderByAggregateInput;
};
export type DocumentTypeScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocumentTypeScalarWhereWithAggregatesInput | Prisma.DocumentTypeScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocumentTypeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocumentTypeScalarWhereWithAggregatesInput | Prisma.DocumentTypeScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"DocumentType"> | string;
    name?: Prisma.StringWithAggregatesFilter<"DocumentType"> | string;
    code?: Prisma.StringWithAggregatesFilter<"DocumentType"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"DocumentType"> | string | null;
    status?: Prisma.BoolWithAggregatesFilter<"DocumentType"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DocumentType"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"DocumentType"> | Date | string;
};
export type DocumentTypeCreateInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    status?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutDocumentTypeInput;
};
export type DocumentTypeUncheckedCreateInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    status?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutDocumentTypeInput;
};
export type DocumentTypeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutDocumentTypeNestedInput;
};
export type DocumentTypeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutDocumentTypeNestedInput;
};
export type DocumentTypeCreateManyInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    status?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DocumentTypeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentTypeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentTypeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DocumentTypeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DocumentTypeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DocumentTypeScalarRelationFilter = {
    is?: Prisma.DocumentTypeWhereInput;
    isNot?: Prisma.DocumentTypeWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type DocumentTypeCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.DocumentTypeCreateWithoutUsersInput, Prisma.DocumentTypeUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.DocumentTypeCreateOrConnectWithoutUsersInput;
    connect?: Prisma.DocumentTypeWhereUniqueInput;
};
export type DocumentTypeUpdateOneRequiredWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.DocumentTypeCreateWithoutUsersInput, Prisma.DocumentTypeUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.DocumentTypeCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.DocumentTypeUpsertWithoutUsersInput;
    connect?: Prisma.DocumentTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocumentTypeUpdateToOneWithWhereWithoutUsersInput, Prisma.DocumentTypeUpdateWithoutUsersInput>, Prisma.DocumentTypeUncheckedUpdateWithoutUsersInput>;
};
export type DocumentTypeCreateWithoutUsersInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    status?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DocumentTypeUncheckedCreateWithoutUsersInput = {
    id?: string;
    name: string;
    code: string;
    description?: string | null;
    status?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DocumentTypeCreateOrConnectWithoutUsersInput = {
    where: Prisma.DocumentTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocumentTypeCreateWithoutUsersInput, Prisma.DocumentTypeUncheckedCreateWithoutUsersInput>;
};
export type DocumentTypeUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.DocumentTypeUpdateWithoutUsersInput, Prisma.DocumentTypeUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.DocumentTypeCreateWithoutUsersInput, Prisma.DocumentTypeUncheckedCreateWithoutUsersInput>;
    where?: Prisma.DocumentTypeWhereInput;
};
export type DocumentTypeUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.DocumentTypeWhereInput;
    data: Prisma.XOR<Prisma.DocumentTypeUpdateWithoutUsersInput, Prisma.DocumentTypeUncheckedUpdateWithoutUsersInput>;
};
export type DocumentTypeUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentTypeUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentTypeCountOutputType = {
    users: number;
};
export type DocumentTypeCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | DocumentTypeCountOutputTypeCountUsersArgs;
};
export type DocumentTypeCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeCountOutputTypeSelect<ExtArgs> | null;
};
export type DocumentTypeCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type DocumentTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    users?: boolean | Prisma.DocumentType$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.DocumentTypeCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documentType"]>;
export type DocumentTypeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["documentType"]>;
export type DocumentTypeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["documentType"]>;
export type DocumentTypeSelectScalar = {
    id?: boolean;
    name?: boolean;
    code?: boolean;
    description?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DocumentTypeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "code" | "description" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["documentType"]>;
export type DocumentTypeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.DocumentType$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.DocumentTypeCountOutputTypeDefaultArgs<ExtArgs>;
};
export type DocumentTypeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type DocumentTypeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $DocumentTypePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DocumentType";
    objects: {
        users: Prisma.$UserPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        status: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["documentType"]>;
    composites: {};
};
export type DocumentTypeGetPayload<S extends boolean | null | undefined | DocumentTypeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload, S>;
export type DocumentTypeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocumentTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocumentTypeCountAggregateInputType | true;
};
export interface DocumentTypeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DocumentType'];
        meta: {
            name: 'DocumentType';
        };
    };
    findUnique<T extends DocumentTypeFindUniqueArgs>(args: Prisma.SelectSubset<T, DocumentTypeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocumentTypeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocumentTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocumentTypeFindFirstArgs>(args?: Prisma.SelectSubset<T, DocumentTypeFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocumentTypeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocumentTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocumentTypeFindManyArgs>(args?: Prisma.SelectSubset<T, DocumentTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocumentTypeCreateArgs>(args: Prisma.SelectSubset<T, DocumentTypeCreateArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocumentTypeCreateManyArgs>(args?: Prisma.SelectSubset<T, DocumentTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocumentTypeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocumentTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocumentTypeDeleteArgs>(args: Prisma.SelectSubset<T, DocumentTypeDeleteArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocumentTypeUpdateArgs>(args: Prisma.SelectSubset<T, DocumentTypeUpdateArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocumentTypeDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocumentTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocumentTypeUpdateManyArgs>(args: Prisma.SelectSubset<T, DocumentTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocumentTypeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocumentTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocumentTypeUpsertArgs>(args: Prisma.SelectSubset<T, DocumentTypeUpsertArgs<ExtArgs>>): Prisma.Prisma__DocumentTypeClient<runtime.Types.Result.GetResult<Prisma.$DocumentTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocumentTypeCountArgs>(args?: Prisma.Subset<T, DocumentTypeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocumentTypeCountAggregateOutputType> : number>;
    aggregate<T extends DocumentTypeAggregateArgs>(args: Prisma.Subset<T, DocumentTypeAggregateArgs>): Prisma.PrismaPromise<GetDocumentTypeAggregateType<T>>;
    groupBy<T extends DocumentTypeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocumentTypeGroupByArgs['orderBy'];
    } : {
        orderBy?: DocumentTypeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocumentTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocumentTypeFieldRefs;
}
export interface Prisma__DocumentTypeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.DocumentType$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocumentType$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocumentTypeFieldRefs {
    readonly id: Prisma.FieldRef<"DocumentType", 'String'>;
    readonly name: Prisma.FieldRef<"DocumentType", 'String'>;
    readonly code: Prisma.FieldRef<"DocumentType", 'String'>;
    readonly description: Prisma.FieldRef<"DocumentType", 'String'>;
    readonly status: Prisma.FieldRef<"DocumentType", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"DocumentType", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"DocumentType", 'DateTime'>;
}
export type DocumentTypeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    where: Prisma.DocumentTypeWhereUniqueInput;
};
export type DocumentTypeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    where: Prisma.DocumentTypeWhereUniqueInput;
};
export type DocumentTypeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    where?: Prisma.DocumentTypeWhereInput;
    orderBy?: Prisma.DocumentTypeOrderByWithRelationInput | Prisma.DocumentTypeOrderByWithRelationInput[];
    cursor?: Prisma.DocumentTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentTypeScalarFieldEnum | Prisma.DocumentTypeScalarFieldEnum[];
};
export type DocumentTypeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    where?: Prisma.DocumentTypeWhereInput;
    orderBy?: Prisma.DocumentTypeOrderByWithRelationInput | Prisma.DocumentTypeOrderByWithRelationInput[];
    cursor?: Prisma.DocumentTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentTypeScalarFieldEnum | Prisma.DocumentTypeScalarFieldEnum[];
};
export type DocumentTypeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    where?: Prisma.DocumentTypeWhereInput;
    orderBy?: Prisma.DocumentTypeOrderByWithRelationInput | Prisma.DocumentTypeOrderByWithRelationInput[];
    cursor?: Prisma.DocumentTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentTypeScalarFieldEnum | Prisma.DocumentTypeScalarFieldEnum[];
};
export type DocumentTypeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocumentTypeCreateInput, Prisma.DocumentTypeUncheckedCreateInput>;
};
export type DocumentTypeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocumentTypeCreateManyInput | Prisma.DocumentTypeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocumentTypeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    data: Prisma.DocumentTypeCreateManyInput | Prisma.DocumentTypeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocumentTypeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocumentTypeUpdateInput, Prisma.DocumentTypeUncheckedUpdateInput>;
    where: Prisma.DocumentTypeWhereUniqueInput;
};
export type DocumentTypeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocumentTypeUpdateManyMutationInput, Prisma.DocumentTypeUncheckedUpdateManyInput>;
    where?: Prisma.DocumentTypeWhereInput;
    limit?: number;
};
export type DocumentTypeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocumentTypeUpdateManyMutationInput, Prisma.DocumentTypeUncheckedUpdateManyInput>;
    where?: Prisma.DocumentTypeWhereInput;
    limit?: number;
};
export type DocumentTypeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    where: Prisma.DocumentTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocumentTypeCreateInput, Prisma.DocumentTypeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocumentTypeUpdateInput, Prisma.DocumentTypeUncheckedUpdateInput>;
};
export type DocumentTypeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
    where: Prisma.DocumentTypeWhereUniqueInput;
};
export type DocumentTypeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentTypeWhereInput;
    limit?: number;
};
export type DocumentType$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type DocumentTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentTypeSelect<ExtArgs> | null;
    omit?: Prisma.DocumentTypeOmit<ExtArgs> | null;
    include?: Prisma.DocumentTypeInclude<ExtArgs> | null;
};
