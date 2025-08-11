import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    description: 'Indica si la subida fue exitosa',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Nombre del archivo generado',
    example: 'restaurant_main_1691674800000_abc123.jpg'
  })
  fileName: string;

  @ApiProperty({
    description: 'URL completa del archivo',
    example: 'http://localhost:3001/uploads/places/restaurant_main_1691674800000_abc123.jpg'
  })
  url: string;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 1024768
  })
  size: number;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'image/jpeg'
  })
  mimetype: string;

  @ApiProperty({
    description: 'Ruta relativa del archivo',
    example: 'places/restaurant_main_1691674800000_abc123.jpg'
  })
  filePath: string;
}

export class BulkUploadResponseDto {
  @ApiProperty({
    description: 'Indica si todas las subidas fueron exitosas',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Número total de archivos procesados',
    example: 3
  })
  totalFiles: number;

  @ApiProperty({
    description: 'Número de archivos subidos exitosamente',
    example: 3
  })
  successCount: number;

  @ApiProperty({
    description: 'Número de archivos que fallaron',
    example: 0
  })
  failureCount: number;

  @ApiProperty({
    description: 'Array de resultados individuales',
    type: [FileUploadResponseDto]
  })
  files: FileUploadResponseDto[];

  @ApiProperty({
    description: 'Array de errores si los hubo',
    example: [],
    required: false
  })
  errors?: string[];
}

export class DeleteFileResponseDto {
  @ApiProperty({
    description: 'Indica si la eliminación fue exitosa',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo',
    example: 'Archivo eliminado correctamente'
  })
  message: string;

  @ApiProperty({
    description: 'Nombre del archivo eliminado',
    example: 'restaurant_main_1691674800000_abc123.jpg'
  })
  fileName: string;
}
