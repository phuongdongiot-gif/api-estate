import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from '../database/entities/property.entity';
import { Property } from './models/property.model';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepo: Repository<PropertyEntity>,
  ) {}

  async findAll(): Promise<Property[]> {
    try {
      return await this.propertyRepo.find({
        order: { created_at: 'DESC' },
      });
    } catch (error: any) {
      this.logger.error('DB error: ' + error.message);
      return [];
    }
  }

  async findById(id: string): Promise<Property | null> {
    return await this.propertyRepo.findOneBy({ id });
  }

  async upsertProperty(propertyData: Partial<PropertyEntity>): Promise<any> {
    try {
      await this.propertyRepo.upsert(propertyData, ['id']);
      return propertyData;
    } catch (error: any) {
      this.logger.error('Error upserting property:', error.message);
      throw new Error(error.message);
    }
  }

  async deleteById(id: string): Promise<any> {
    try {
      const result = await this.propertyRepo.delete(id);
      return result;
    } catch (error: any) {
      this.logger.error('Error deleting property:', error.message);
      throw new Error(error.message);
    }
  }
}
