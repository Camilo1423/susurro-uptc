var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import aws from 'aws-sdk';
let BucketService = class BucketService {
    configService;
    s3;
    constructor(configService) {
        this.configService = configService;
        this.s3 = new aws.S3({
            endpoint: this.configService.getOrThrow('spaces_endpoint'),
            accessKeyId: this.configService.getOrThrow('spaces_key'),
            secretAccessKey: this.configService.getOrThrow('spaces_secret'),
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
        });
    }
    get bucket() {
        return this.configService.getOrThrow('spaces_bucket');
    }
    async uploadItem(key, content, options) {
        try {
            const params = {
                Bucket: this.bucket,
                Key: key,
                Body: content,
                ACL: options?.acl ?? 'public-read',
                ContentType: this.getContentType(key),
            };
            const data = await this.s3.upload(params).promise();
            return data.Key;
        }
        catch (error) {
            throw new InternalServerErrorException(`Error al subir objeto: ${error.message}`);
        }
    }
    async getItem(key) {
        try {
            const data = await this.s3
                .getObject({ Bucket: this.bucket, Key: key })
                .promise();
            return data.Body;
        }
        catch (error) {
            throw new InternalServerErrorException(`Error al obtener objeto: ${error.message}`);
        }
    }
    async deleteItem(key) {
        try {
            await this.s3
                .deleteObject({ Bucket: this.bucket, Key: key })
                .promise();
        }
        catch (error) {
            throw new InternalServerErrorException(`Error al eliminar objeto: ${error.message}`);
        }
    }
    async deleteByPrefix(prefix) {
        try {
            const listed = await this.s3
                .listObjectsV2({ Bucket: this.bucket, Prefix: prefix })
                .promise();
            const objects = listed.Contents;
            if (!objects || objects.length === 0)
                return;
            await this.s3
                .deleteObjects({
                Bucket: this.bucket,
                Delete: { Objects: objects.map((o) => ({ Key: o.Key })) },
            })
                .promise();
        }
        catch (error) {
            throw new InternalServerErrorException(`Error al eliminar objetos por prefijo: ${error.message}`);
        }
    }
    async listKeysByPrefix(prefix) {
        try {
            const listed = await this.s3
                .listObjectsV2({ Bucket: this.bucket, Prefix: prefix })
                .promise();
            return (listed.Contents ?? [])
                .map((o) => o.Key)
                .filter((k) => k !== undefined && k.length > 0);
        }
        catch (error) {
            throw new InternalServerErrorException(`Error al listar objetos por prefijo: ${error.message}`);
        }
    }
    publicUrl(key) {
        const endpoint = this.configService
            .getOrThrow('spaces_endpoint')
            .replace(/\/+$/, '');
        return `${endpoint}/${this.bucket}/${key}`;
    }
    contentTypeForKey(key) {
        return this.getContentType(key);
    }
    getContentType(fileName) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const mimeTypes = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            svg: 'image/svg+xml',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            txt: 'text/plain',
            mp3: 'audio/mpeg',
            wav: 'audio/wav',
            ogg: 'audio/ogg',
            m4a: 'audio/mp4',
            aac: 'audio/aac',
            webm: 'audio/webm',
        };
        return (mimeTypes[extension] ??
            'application/octet-stream');
    }
};
BucketService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], BucketService);
export { BucketService };
//# sourceMappingURL=bucket.service.js.map