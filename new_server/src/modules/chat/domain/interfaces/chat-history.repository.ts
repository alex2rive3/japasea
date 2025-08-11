export interface ChatHistoryRepository {
  // TODO: Define repository interface
  findByUserId(userId: string): Promise<any[]>;
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
}
