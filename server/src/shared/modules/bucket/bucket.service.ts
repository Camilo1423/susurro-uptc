import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import aws from 'aws-sdk';

/**
 * Servicio de almacenamiento de objetos sobre MinIO (S3-compatible). Clonado del
 * BucketService de medilaser: `s3ForcePathStyle` + `signatureVersion v4` son lo
 * que hace funcionar el SDK de AWS contra MinIO.
 */
@Injectable()
export class BucketService {
  private readonly s3: aws.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new aws.S3({
      endpoint: this.configService.getOrThrow<string>('spaces_endpoint'),
      accessKeyId: this.configService.getOrThrow<string>('spaces_key'),
      secretAccessKey: this.configService.getOrThrow<string>('spaces_secret'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  private get bucket(): string {
    return this.configService.getOrThrow<string>('spaces_bucket');
  }

  /**
   * Sube un objeto al bucket.
   * @param key  Ruta/nombre del objeto (p. ej. `avatars/<userId>.png`).
   * @param content  Contenido en Buffer.
   * @param options.acl  `public-read` (por defecto) o `private`.
   * @returns La key del objeto guardado.
   */
  async uploadItem(
    key: string,
    content: Buffer,
    options?: { acl?: 'public-read' | 'private' },
  ): Promise<string> {
    try {
      const params: aws.S3.PutObjectRequest = {
        Bucket: this.bucket,
        Key: key,
        Body: content,
        ACL: options?.acl ?? 'public-read',
        ContentType: this.getContentType(key),
      };
      const data = await this.s3.upload(params).promise();
      return data.Key;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al subir objeto: ${(error as Error).message}`,
      );
    }
  }

  /** Obtiene el contenido de un objeto. */
  async getItem(key: string): Promise<Buffer> {
    try {
      const data = await this.s3
        .getObject({ Bucket: this.bucket, Key: key })
        .promise();
      return data.Body as Buffer;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener objeto: ${(error as Error).message}`,
      );
    }
  }

  /** Elimina un objeto. */
  async deleteItem(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({ Bucket: this.bucket, Key: key })
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar objeto: ${(error as Error).message}`,
      );
    }
  }

  /** Elimina todos los objetos bajo un prefijo. */
  async deleteByPrefix(prefix: string): Promise<void> {
    try {
      const listed = await this.s3
        .listObjectsV2({ Bucket: this.bucket, Prefix: prefix })
        .promise();

      const objects = listed.Contents;
      if (!objects || objects.length === 0) return;

      await this.s3
        .deleteObjects({
          Bucket: this.bucket,
          Delete: { Objects: objects.map((o) => ({ Key: o.Key as string })) },
        })
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar objetos por prefijo: ${(error as Error).message}`,
      );
    }
  }

  /** Lista las keys de objetos bajo un prefijo. */
  async listKeysByPrefix(prefix: string): Promise<string[]> {
    try {
      const listed = await this.s3
        .listObjectsV2({ Bucket: this.bucket, Prefix: prefix })
        .promise();

      return (listed.Contents ?? [])
        .map((o) => o.Key)
        .filter((k): k is string => k !== undefined && k.length > 0);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al listar objetos por prefijo: ${(error as Error).message}`,
      );
    }
  }

  /** URL pública de un objeto (path-style, como sirve MinIO). */
  publicUrl(key: string): string {
    const endpoint = this.configService
      .getOrThrow<string>('spaces_endpoint')
      .replace(/\/+$/, '');
    return `${endpoint}/${this.bucket}/${key}`;
  }

  contentTypeForKey(key: string): string {
    return this.getContentType(key);
  }

  /** Detecta el Content-Type según la extensión del archivo. */
  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
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
    return (
      mimeTypes[extension as keyof typeof mimeTypes] ??
      'application/octet-stream'
    );
  }
}
