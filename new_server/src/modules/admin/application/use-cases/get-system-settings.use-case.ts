import { Injectable, Inject } from '@nestjs/common';
import { GetSystemSettingsUseCase } from '../../domain/interfaces/admin.use-cases';
import { SystemSettingsResponseDto } from '../dtos/response.dto';

@Injectable()
export class GetSystemSettingsUseCaseImpl implements GetSystemSettingsUseCase {
  constructor(
    @Inject('SettingsRepository') private readonly settingsRepository: any,
  ) {}

  async execute(): Promise<SystemSettingsResponseDto> {
    const settings = await this.settingsRepository.findActive();
    
    const result: SystemSettingsResponseDto = {};
    
    settings.forEach(setting => {
      result[setting.key] = {
        value: setting.value,
        type: setting.type,
        description: setting.description,
        isSystem: setting.isSystem
      };
    });

    return result;
  }
}
