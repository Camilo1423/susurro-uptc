import { ConfigService } from '@nestjs/config';
export declare class BucketService {
    private readonly configService;
    private readonly s3;
    constructor(configService: ConfigService);
    private get bucket();
    uploadItem(key: string, content: Buffer, options?: {
        acl?: 'public-read' | 'private';
    }): Promise<string>;
    getItem(key: string): Promise<Buffer>;
    deleteItem(key: string): Promise<void>;
    deleteByPrefix(prefix: string): Promise<void>;
    listKeysByPrefix(prefix: string): Promise<string[]>;
    publicUrl(key: string): string;
    contentTypeForKey(key: string): string;
    private getContentType;
}
