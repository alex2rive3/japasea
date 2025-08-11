import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch,
  Param, 
  Body, 
  Query, 
  UseGuards,
  Inject,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles, CurrentUser, UserRole } from '../../../shared';

import {
  SetPlaceStatusDto,
  VerifyPlaceDto,
  FeaturePlaceDto,
  AdminListPlacesQueryDto,
  UpdateUserRoleDto,
  SuspendUserDto,
  AdminListUsersQueryDto,
  SendBulkNotificationDto,
  UpdateSystemSettingsDto,
  AdminListReviewsQueryDto,
  ReviewModerationDto
} from '../application/dtos/request.dto';

import {
  AdminStatsResponseDto,
  PlaceStatsResponseDto,
  SystemSettingsResponseDto
} from '../application/dtos/response.dto';

import {
  SetPlaceStatusUseCase,
  VerifyPlaceUseCase,
  FeaturePlaceUseCase,
  GetAdminPlaceUseCase,
  ListAdminPlacesUseCase,
  ListAdminUsersUseCase,
  GetUserDetailsUseCase,
  UpdateUserRoleUseCase,
  SuspendUserUseCase,
  ActivateUserUseCase,
  DeleteUserUseCase,
  GetAdminStatsUseCase,
  GetPlaceStatsUseCase,
  GetSystemSettingsUseCase,
  UpdateSystemSettingsUseCase,
  SendBulkNotificationUseCase,
  ListAdminReviewsUseCase,
  ApproveReviewUseCase,
  RejectReviewUseCase,
  DeleteReviewUseCase
} from '../domain/interfaces/admin.use-cases';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('api/admin')
export class AdminController {
  constructor(
    @Inject('SetPlaceStatusUseCase') private readonly setPlaceStatusUseCase: SetPlaceStatusUseCase,
    @Inject('VerifyPlaceUseCase') private readonly verifyPlaceUseCase: VerifyPlaceUseCase,
    @Inject('FeaturePlaceUseCase') private readonly featurePlaceUseCase: FeaturePlaceUseCase,
    @Inject('GetAdminPlaceUseCase') private readonly getAdminPlaceUseCase: GetAdminPlaceUseCase,
    @Inject('ListAdminPlacesUseCase') private readonly listAdminPlacesUseCase: ListAdminPlacesUseCase,
    @Inject('ListAdminUsersUseCase') private readonly listAdminUsersUseCase: ListAdminUsersUseCase,
    @Inject('GetUserDetailsUseCase') private readonly getUserDetailsUseCase: GetUserDetailsUseCase,
    @Inject('UpdateUserRoleUseCase') private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    @Inject('SuspendUserUseCase') private readonly suspendUserUseCase: SuspendUserUseCase,
    @Inject('ActivateUserUseCase') private readonly activateUserUseCase: ActivateUserUseCase,
    @Inject('DeleteUserUseCase') private readonly deleteUserUseCase: DeleteUserUseCase,
    @Inject('GetAdminStatsUseCase') private readonly getAdminStatsUseCase: GetAdminStatsUseCase,
    @Inject('GetPlaceStatsUseCase') private readonly getPlaceStatsUseCase: GetPlaceStatsUseCase,
    @Inject('GetSystemSettingsUseCase') private readonly getSystemSettingsUseCase: GetSystemSettingsUseCase,
    @Inject('UpdateSystemSettingsUseCase') private readonly updateSystemSettingsUseCase: UpdateSystemSettingsUseCase,
    @Inject('SendBulkNotificationUseCase') private readonly sendBulkNotificationUseCase: SendBulkNotificationUseCase,
    @Inject('ListAdminReviewsUseCase') private readonly listAdminReviewsUseCase: ListAdminReviewsUseCase,
    @Inject('ApproveReviewUseCase') private readonly approveReviewUseCase: ApproveReviewUseCase,
    @Inject('RejectReviewUseCase') private readonly rejectReviewUseCase: RejectReviewUseCase,
    @Inject('DeleteReviewUseCase') private readonly deleteReviewUseCase: DeleteReviewUseCase,
  ) {}

  // Places Management
  @Roles(UserRole.ADMIN)
  @Patch('places/:id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cambiar estado de un lugar' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
  async setPlaceStatus(
    @CurrentUser() user: any,
    @Param('id') placeId: string,
    @Body() setPlaceStatusDto: SetPlaceStatusDto,
  ) {
    return this.setPlaceStatusUseCase.execute(placeId, setPlaceStatusDto, user.id);
  }

  @Roles(UserRole.ADMIN)
  @Patch('places/:id/verify')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Verificar o desverificar un lugar' })
  @ApiResponse({ status: 200, description: 'Verificación actualizada correctamente' })
  async verifyPlace(
    @CurrentUser() user: any,
    @Param('id') placeId: string,
    @Body() verifyPlaceDto: VerifyPlaceDto,
  ) {
    return this.verifyPlaceUseCase.execute(placeId, verifyPlaceDto, user.id);
  }

  @Roles(UserRole.ADMIN)
  @Patch('places/:id/feature')
  @ApiOperation({ summary: 'Destacar o no destacar un lugar' })
  @ApiResponse({ status: 200, description: 'Estado de destacado actualizado correctamente' })
  async featurePlace(
    @Param('id') placeId: string,
    @Body() featurePlaceDto: FeaturePlaceDto,
  ) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.featurePlaceUseCase.execute(placeId, featurePlaceDto, adminUserId);
  }

  @Roles(UserRole.ADMIN)
  @Get('places/:id')
  @ApiOperation({ summary: 'Obtener detalles de un lugar para admin' })
  @ApiResponse({ status: 200, description: 'Detalles del lugar obtenidos correctamente' })
  async getPlace(@Param('id') placeId: string) {
    return this.getAdminPlaceUseCase.execute(placeId);
  }

  @Roles(UserRole.ADMIN)
  @Get('places')
  @ApiOperation({ summary: 'Listar lugares para administración' })
  @ApiResponse({ status: 200, description: 'Lista de lugares obtenida correctamente' })
  async listPlaces(@Query() query: AdminListPlacesQueryDto) {
    return this.listAdminPlacesUseCase.execute(query);
  }

  // Users Management
  @Roles(UserRole.ADMIN)
  @Get('users')
  @ApiOperation({ summary: 'Listar usuarios para administración' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida correctamente' })
  async listUsers(@Query() query: AdminListUsersQueryDto) {
    return this.listAdminUsersUseCase.execute(query);
  }

  @Roles(UserRole.ADMIN)
  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener detalles de un usuario' })
  @ApiResponse({ status: 200, description: 'Detalles del usuario obtenidos correctamente' })
  async getUserById(@Param('id') userId: string) {
    return this.getUserDetailsUseCase.execute(userId);
  }

  @Roles(UserRole.ADMIN)
  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Actualizar rol de usuario' })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.updateUserRoleUseCase.execute(userId, updateUserRoleDto, adminUserId);
  }

  @Roles(UserRole.ADMIN)
  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspender usuario' })
  @ApiResponse({ status: 200, description: 'Usuario suspendido correctamente' })
  async suspendUser(
    @Param('id') userId: string,
    @Body() suspendUserDto: SuspendUserDto,
  ) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.suspendUserUseCase.execute(userId, suspendUserDto, adminUserId);
  }

  @Roles(UserRole.ADMIN)
  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Activar usuario suspendido' })
  @ApiResponse({ status: 200, description: 'Usuario activado correctamente' })
  async activateUser(@Param('id') userId: string) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.activateUserUseCase.execute(userId, adminUserId);
  }

  @Roles(UserRole.ADMIN)
  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado correctamente' })
  async deleteUser(@Param('id') userId: string) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    await this.deleteUserUseCase.execute(userId, adminUserId);
  }

  // Statistics
  @Roles(UserRole.ADMIN)
  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas del sistema' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente', type: AdminStatsResponseDto })
  async getStats(): Promise<AdminStatsResponseDto> {
    return this.getAdminStatsUseCase.execute();
  }

  @Roles(UserRole.ADMIN)
  @Get('stats/places')
  @ApiOperation({ summary: 'Obtener estadísticas de lugares' })
  @ApiResponse({ status: 200, description: 'Estadísticas de lugares obtenidas correctamente', type: PlaceStatsResponseDto })
  async getPlaceStats(): Promise<PlaceStatsResponseDto> {
    return this.getPlaceStatsUseCase.execute();
  }

  // System Settings
  @Roles(UserRole.ADMIN)
  @Get('settings')
  @ApiOperation({ summary: 'Obtener configuraciones del sistema' })
  @ApiResponse({ status: 200, description: 'Configuraciones obtenidas correctamente', type: SystemSettingsResponseDto })
  async getSystemSettings(): Promise<SystemSettingsResponseDto> {
    return this.getSystemSettingsUseCase.execute();
  }

  @Roles(UserRole.ADMIN)
  @Put('settings')
  @ApiOperation({ summary: 'Actualizar configuraciones del sistema' })
  @ApiResponse({ status: 200, description: 'Configuraciones actualizadas correctamente', type: SystemSettingsResponseDto })
  async updateSystemSettings(
    @Body() updateSystemSettingsDto: UpdateSystemSettingsDto,
  ): Promise<SystemSettingsResponseDto> {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.updateSystemSettingsUseCase.execute(updateSystemSettingsDto, adminUserId);
  }

  // Notifications
  @Roles(UserRole.ADMIN)
  @Post('notifications/bulk')
  @ApiOperation({ summary: 'Enviar notificación masiva' })
  @ApiResponse({ status: 200, description: 'Notificación enviada correctamente' })
  async sendBulkNotification(
    @Body() sendBulkNotificationDto: SendBulkNotificationDto,
  ) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.sendBulkNotificationUseCase.execute(sendBulkNotificationDto, adminUserId);
  }

  // Reviews Management
  @Roles(UserRole.ADMIN)
  @Get('reviews')
  @ApiOperation({ summary: 'Listar reseñas para moderación' })
  @ApiResponse({ status: 200, description: 'Lista de reseñas obtenida correctamente' })
  async listReviews(@Query() query: AdminListReviewsQueryDto) {
    return this.listAdminReviewsUseCase.execute(query);
  }

  @Roles(UserRole.ADMIN)
  @Patch('reviews/:id/approve')
  @ApiOperation({ summary: 'Aprobar reseña' })
  @ApiResponse({ status: 200, description: 'Reseña aprobada correctamente' })
  async approveReview(
    @Param('id') reviewId: string,
    @Body() reviewModerationDto: ReviewModerationDto,
  ) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.approveReviewUseCase.execute(reviewId, reviewModerationDto, adminUserId);
  }

  @Roles(UserRole.ADMIN)
  @Patch('reviews/:id/reject')
  @ApiOperation({ summary: 'Rechazar reseña' })
  @ApiResponse({ status: 200, description: 'Reseña rechazada correctamente' })
  async rejectReview(
    @Param('id') reviewId: string,
    @Body() reviewModerationDto: ReviewModerationDto,
  ) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    return this.rejectReviewUseCase.execute(reviewId, reviewModerationDto, adminUserId);
  }

  @Roles(UserRole.ADMIN)
  @Delete('reviews/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar reseña' })
  @ApiResponse({ status: 204, description: 'Reseña eliminada correctamente' })
  async deleteReview(@Param('id') reviewId: string) {
    const adminUserId = 'temp-admin-id'; // TODO: Obtener del token JWT
    await this.deleteReviewUseCase.execute(reviewId, adminUserId);
  }
}
