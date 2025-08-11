import { Injectable, Inject } from '@nestjs/common';
import { UpdateSystemSettingsUseCase } from '../../domain/interfaces/admin.use-cases';
import { UpdateSystemSettingsDto } from '../dtos/request.dto';
import { SystemSettingsResponseDto } from '../dtos/response.dto';

@Injectable()
export class UpdateSystemSettingsUseCaseImpl implements UpdateSystemSettingsUseCase {
  constructor(
    @Inject('SettingsRepository') private readonly settingsRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(data: UpdateSystemSettingsDto, adminUserId: string): Promise<SystemSettingsResponseDto> {
    const updatedSettings: SystemSettingsResponseDto = {};
    
    // Procesar cada configuración
    for (const [key, value] of Object.entries(data.settings)) {
      const existingSetting = await this.settingsRepository.findByKey(key);
      const oldValue = existingSetting?.value;
      
      const setting = await this.settingsRepository.createOrUpdate(
        key,
        value,
        existingSetting?.description,
        existingSetting?.type
      );

      updatedSettings[key] = {
        value: setting.value,
        type: setting.type,
        description: setting.description,
        isSystem: setting.isSystem
      };

      // Crear registro de auditoría
      await this.auditRepository.create({
        action: existingSetting ? 'update_setting' : 'create_setting',
        resource: 'settings',
        resourceId: setting._id,
        userId: adminUserId,
        metadata: {
          settingKey: key,
          oldValue,
          newValue: value,
        },
        oldData: { [key]: oldValue },
        newData: { [key]: value },
      });
    }

    return updatedSettings;
  }
}
