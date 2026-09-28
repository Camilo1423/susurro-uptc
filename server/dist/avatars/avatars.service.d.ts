import { EventEmitter2 } from '@nestjs/event-emitter';
import { AvatarType } from '../generated/prisma/enums.js';
import { PrismaService } from '../shared/modules/prisma/index.js';
import { BucketService } from '../shared/modules/bucket/index.js';
export interface AvatarUrls {
    thumbnail: string | null;
    original: string | null;
}
export declare class AvatarsService {
    private readonly prisma;
    private readonly bucket;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, bucket: BucketService, eventEmitter: EventEmitter2);
    private prefix;
    upload(userId: string, file?: Express.Multer.File): Promise<AvatarUrls>;
    remove(userId: string): Promise<void>;
    private apiPath;
    private canView;
    getAvatarFile(viewerId: string, targetId: string, type: AvatarType): Promise<{
        buffer: Buffer;
        contentType: string;
    }>;
}
