import * as runtime from "@prisma/client/runtime/client";
export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export const PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export const PrismaClientValidationError = runtime.PrismaClientValidationError;
export const sql = runtime.sqltag;
export const empty = runtime.empty;
export const join = runtime.join;
export const raw = runtime.raw;
export const Sql = runtime.Sql;
export const Decimal = runtime.Decimal;
export const getExtensionContext = runtime.Extensions.getExtensionContext;
export const prismaVersion = {
    client: "7.10.0",
    engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    DocumentType: 'DocumentType',
    User: 'User',
    Session: 'Session',
    RefreshToken: 'RefreshToken',
    UserAvatar: 'UserAvatar',
    BlackListAccessToken: 'BlackListAccessToken',
    Conversation: 'Conversation',
    Message: 'Message'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const DocumentTypeScalarFieldEnum = {
    id: 'id',
    name: 'name',
    code: 'code',
    description: 'description',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    username: 'username',
    password: 'password',
    firstName: 'firstName',
    secondName: 'secondName',
    firstLastName: 'firstLastName',
    secondLastName: 'secondLastName',
    documentTypeId: 'documentTypeId',
    documentNumber: 'documentNumber',
    phoneNumber: 'phoneNumber',
    pin: 'pin',
    status: 'status',
    emailVerified: 'emailVerified',
    requireChangePassword: 'requireChangePassword',
    failedAttempts: 'failedAttempts',
    lockedUntil: 'lockedUntil',
    blockedAt: 'blockedAt',
    lastLogin: 'lastLogin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const SessionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    jti: 'jti',
    sessionKey: 'sessionKey',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    isActive: 'isActive',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const RefreshTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    sessionKey: 'sessionKey',
    jti: 'jti',
    isRevoked: 'isRevoked',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const UserAvatarScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    key: 'key',
    url: 'url',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const BlackListAccessTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    jti: 'jti',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
export const ConversationScalarFieldEnum = {
    id: 'id',
    userAId: 'userAId',
    userBId: 'userBId',
    aliasA: 'aliasA',
    aliasB: 'aliasB',
    anonymousA: 'anonymousA',
    anonymousB: 'anonymousB',
    lastMessageAt: 'lastMessageAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const MessageScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    senderId: 'senderId',
    content: 'content',
    readAt: 'readAt',
    replyToId: 'replyToId',
    createdAt: 'createdAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
export const defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map