import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from '../database/entities/location.entity';
import { Location } from './models/location.model';
import axios from 'axios';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,
  ) {}

  async findAll(): Promise<Location[]> {
    try {
      return await this.locationRepo.find({
        order: { name: 'ASC' },
      });
    } catch (error: any) {
      this.logger.error('Error fetching locations:', error.message);
      return [];
    }
  }

  // Hàm Sync Gọi API Tỉnh Thành kéo 63 củ về — Ghi thẳng vào Neon PostgreSQL
  async syncVietnamProvinces(): Promise<any> {
    try {
      this.logger.log('Đang fetch 63 tỉnh thành...');
      const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
      const provinces = response.data;

      let count = 0;
      for (const province of provinces) {
        const provinceName = province.name.replace('Tỉnh ', '').replace('Thành phố ', '');
        // Tạo slug chuẩn (Bỏ dấu, gạch ngang)
        const slug = provinceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/ /g, '-');

        // Ghi thẳng vào Neon PostgreSQL
        await this.locationRepo.upsert({
          id: `loc-${slug}`,
          slug: slug,
          name: provinceName,
        }, ['id']);

        count++;
      }
      return { success: true, message: `Đã tạo thành công ${count} tỉnh thành vào Neon PostgreSQL!` };
    } catch (error: any) {
      this.logger.error('Lỗi khi Sync: ', error.message);
      return { success: false, error: error.message };
    }
  }

  async upsertLocation(locationData: Partial<LocationEntity>): Promise<any> {
    try {
      await this.locationRepo.upsert(locationData, ['id']);
      return locationData;
    } catch (error: any) {
      this.logger.error('Error upserting location:', error.message);
      throw new Error(error.message);
    }
  }

  async deleteById(id: string): Promise<any> {
    try {
      const result = await this.locationRepo.delete(id);
      return result;
    } catch (error: any) {
      this.logger.error('Error deleting location:', error.message);
      throw new Error(error.message);
    }
  }
}
