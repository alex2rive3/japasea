import { 
  Controller, 
  Post, 
  Delete,
  Param,
  Body,
  UseInterceptors, 
  UploadedFile, 
  UploadedFiles,
  BadRequestException,
  Query
} from '@nestjs/common';
import { 
  FileInterceptor, 
  FilesInterceptor 
} from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiConsumes,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { FileUploadService, UploadedFile as FileType } from '../services/file-upload.service';
import { 
  UploadImageRequestDto, 
  BulkUploadRequestDto 
} from '../dtos/file-upload.request.dto';
import { 
  FileUploadResponseDto, 
  BulkUploadResponseDto, 
  DeleteFileResponseDto 
} from '../dtos/file-upload.response.dto';
import { Roles, CurrentUser, UserRole } from '../index';

@ApiTags('file-upload')
@ApiBearerAuth()
@Controller('api/files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload/single')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir una imagen individual' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente', type: FileUploadResponseDto })
  @ApiResponse({ status: 400, description: 'Archivo inválido o error en la subida' })
  async uploadSingleImage(
    @UploadedFile() file: FileType,
    @Body() uploadDto: UploadImageRequestDto,
    @Query('folder') folder?: string
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const uploadFolder = folder || 'places';
    const result = await this.fileUploadService.uploadImage(file, uploadFolder);
    
    return result;
  }

  @Post('upload/multiple')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 10)) // Máximo 10 archivos
  @ApiOperation({ summary: 'Subir múltiples imágenes' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Imágenes subidas exitosamente', type: BulkUploadResponseDto })
  @ApiResponse({ status: 400, description: 'Error en la subida de archivos' })
  async uploadMultipleImages(
    @UploadedFiles() files: FileType[],
    @Body() bulkUploadDto: BulkUploadRequestDto,
    @Query('folder') folder?: string
  ): Promise<BulkUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos');
    }

    if (files.length > 10) {
      throw new BadRequestException('Máximo 10 archivos permitidos por subida');
    }

    const uploadFolder = folder || 'places';
    const results: FileUploadResponseDto[] = [];
    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.fileUploadService.uploadImage(files[i], uploadFolder);
        results.push(result);
        successCount++;
      } catch (error) {
        errors.push(`Archivo ${i + 1}: ${error.message}`);
        // Agregar resultado fallido para mantener el orden
        results.push({
          success: false,
          fileName: '',
          url: '',
          size: files[i].size,
          mimetype: files[i].mimetype,
          filePath: ''
        });
      }
    }

    return {
      success: successCount === files.length,
      totalFiles: files.length,
      successCount,
      failureCount: files.length - successCount,
      files: results,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  @Delete(':folder/:fileName')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un archivo' })
  @ApiParam({ name: 'folder', description: 'Carpeta donde está el archivo', example: 'places' })
  @ApiParam({ name: 'fileName', description: 'Nombre del archivo a eliminar', example: 'restaurant_1691674800000_abc123.jpg' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado exitosamente', type: DeleteFileResponseDto })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async deleteFile(
    @Param('folder') folder: string,
    @Param('fileName') fileName: string
  ): Promise<DeleteFileResponseDto> {
    const deleted = await this.fileUploadService.deleteFile(fileName, folder);
    
    if (!deleted) {
      throw new BadRequestException('No se pudo eliminar el archivo o no existe');
    }

    return {
      success: true,
      message: 'Archivo eliminado correctamente',
      fileName
    };
  }

  @Post('places/:placeId/images')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Subir imágenes específicamente para un lugar' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'placeId', description: 'ID del lugar', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 201, description: 'Imágenes subidas para el lugar', type: BulkUploadResponseDto })
  async uploadPlaceImages(
    @Param('placeId') placeId: string,
    @UploadedFiles() files: FileType[],
    @Body() uploadDto: BulkUploadRequestDto
  ): Promise<BulkUploadResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron imágenes');
    }

    if (files.length > 5) {
      throw new BadRequestException('Máximo 5 imágenes permitidas por lugar');
    }

    // Usar carpeta específica para el lugar
    const placeFolder = `places/${placeId}`;
    
    const results: FileUploadResponseDto[] = [];
    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.fileUploadService.uploadImage(files[i], placeFolder);
        results.push(result);
        successCount++;
      } catch (error) {
        errors.push(`Imagen ${i + 1}: ${error.message}`);
        results.push({
          success: false,
          fileName: '',
          url: '',
          size: files[i].size,
          mimetype: files[i].mimetype,
          filePath: ''
        });
      }
    }

    return {
      success: successCount === files.length,
      totalFiles: files.length,
      successCount,
      failureCount: files.length - successCount,
      files: results,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
