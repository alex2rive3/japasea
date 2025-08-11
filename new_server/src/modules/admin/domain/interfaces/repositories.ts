import { Audit } from '../entities/audit.entity';
import { Settings } from '../entities/settings.entity';

export interface AuditRepository {
  create(auditData: Partial<Audit>): Promise<Audit>;
  findByUserId(userId: string, page: number, limit: number): Promise<{ data: Audit[]; total: number; }>;
  findByResource(resource: string, resourceId: string): Promise<Audit[]>;
  findRecent(limit: number): Promise<Audit[]>;
}

export interface SettingsRepository {
  findAll(): Promise<Settings[]>;
  findByKey(key: string): Promise<Settings | null>;
  updateByKey(key: string, value: any): Promise<Settings | null>;
  createOrUpdate(key: string, value: any, description?: string, type?: string): Promise<Settings>;
  findActive(): Promise<Settings[]>;
}
