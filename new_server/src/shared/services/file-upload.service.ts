import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface FileUploadResult {
  success: boolean;
  fileName: string;
  filePath: string;
  url: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class FileUploadService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH') || './uploads';
    this.maxFileSize = parseInt(this.configService.get<string>('MAX_FILE_SIZE') || '5242880'); // 5MB default
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];
    this.baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3001';
    
    // Crear directorio de uploads si no existe
    this.ensureUploadDirectory();
  }

  async uploadImage(file: UploadedFile, folder: string = 'places'): Promise<FileUploadResult> {
    // Validar archivo
    this.validateFile(file);

    // Generar nombre único
    const fileName = this.generateFileName(file.originalname);
    const folderPath = path.join(this.uploadPath, folder);
    const filePath = path.join(folderPath, fileName);

    // Crear subdirectorio si no existe
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    try {
      // Guardar archivo
      fs.writeFileSync(filePath, file.buffer);

      return {
        success: true,
        fileName,
        filePath,
        url: `${this.baseUrl}/uploads/${folder}/${fileName}`,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      throw new BadRequestException('Error al guardar el archivo');
    }
  }

  async uploadMultipleImages(files: UploadedFile[], folder: string = 'places'): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];

    for (const file of files) {
      const result = await this.uploadImage(file, folder);
      results.push(result);
    }

    return results;
  }

  async deleteFile(fileName: string, folder: string = 'places'): Promise<boolean> {
    const filePath = path.join(this.uploadPath, folder, fileName);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  private validateFile(file: UploadedFile): void {
    // Validar tamaño
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `El archivo es demasiado grande. Tamaño máximo: ${this.maxFileSize / (1024 * 1024)}MB`
      );
    }

    // Validar tipo MIME
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Tipos permitidos: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    // Validar nombre de archivo
    if (!file.originalname || file.originalname.length === 0) {
      throw new BadRequestException('El archivo debe tener un nombre válido');
    }
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);
    
    return `${baseName}_${timestamp}_${randomString}${extension}`;
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getFileUrl(fileName: string, folder: string = 'places'): string {
    return `${this.baseUrl}/uploads/${folder}/${fileName}`;
  }

  isValidImageFile(mimetype: string): boolean {
    return this.allowedMimeTypes.includes(mimetype);
  }
}
