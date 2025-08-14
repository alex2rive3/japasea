export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(userId: string): Promise<any>;
  findAll(): Promise<any[]>;
  findByRole(role: string): Promise<any[]>;
  create(userData: any): Promise<any>;
  update(userId: string, updateData: any): Promise<any>;
  softDelete(userId: string): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  updateResetPasswordAttempt(userId: string, attemptDate: Date): Promise<void>;
  countDocuments(filter: any): Promise<number>;
  getUserGrowthByMonth(startDate: Date): Promise<Array<{ period: string; count: number }>>;
}
