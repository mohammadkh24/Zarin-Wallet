// utils/uniqueId.util.ts
import { Repository } from 'typeorm';

export async function generateUniqueId<T extends { id: number }>(
  repository: Repository<T>,
  min: number = 1000,
  max: number = 9999,
): Promise<number> {
  let id: number;
  let exists: boolean;

  do {
    id = Math.floor(min + Math.random() * (max - min));
    const entity = await repository.findOneBy({ id } as any);
    exists = !!entity;
  } while (exists);

  return id;
}
