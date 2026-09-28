import { AvatarType } from '../generated/prisma/enums.js';
export function toUserSession(user) {
    const { password: _password, blockedAt: _blockedAt, documentType, avatars, ...rest } = user;
    const avatar = {
        thumbnail: avatars.find((a) => a.type === AvatarType.THUMBNAIL)?.url ?? null,
        original: avatars.find((a) => a.type === AvatarType.ORIGINAL)?.url ?? null,
    };
    return {
        ...rest,
        documentTypeCode: documentType.code,
        documentType: documentType.name,
        avatar,
    };
}
//# sourceMappingURL=user-session.mapper.js.map