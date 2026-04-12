import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Location } from './models/location.model';
import axios from 'axios';
import { createClient } from '@sanity/client';
import type { SanityClient } from '@sanity/client';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  private sanity: SanityClient | undefined;

  constructor(private readonly supabaseService: SupabaseService) {
    if (process.env.SANITY_PROJECT_ID) {
      this.sanity = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET || 'production',
        token: process.env.SANITY_TOKEN,
        useCdn: false,
        apiVersion: '2024-04-11',
      });
    } else {
      this.logger.warn('SANITY_PROJECT_ID is missing. Sanity functions will be gracefully disabled.');
    }
  }

  async findAll(): Promise<Location[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('locations').select('*').order('name', { ascending: true });
    
    if (error) {
      this.logger.error('Error fetching locations:', error.message);
      return [];
    }
    return data || [];
  }

  // Hàm Sync Gọi API Tỉnh Thành kéo 63 củ về
  async syncVietnamProvinces(): Promise<any> {
    try {
      this.logger.log('Đang fetch 63 tỉnh thành...');
      const response = await axios.get('https://provinces.open-api.vn/api/?depth=1');
      const provinces = response.data;
      const supabase = this.supabaseService.getClient();

      if (!this.sanity) {
        throw new Error('Hệ thống SanityCMS chưa được cấu hình (thiếu SANITY_PROJECT_ID). Vui lòng thêm biến môi trường!');
      }

      let count = 0;
      for (const province of provinces) {
        const provinceName = province.name.replace('Tỉnh ', '').replace('Thành phố ', '');
        // Tạo slug chuẩn (Bỏ dấu, gạch ngang)
        const slug = provinceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/ /g, '-');

        // 1. Tạo trên Sanity
        const sanityDoc = {
          _type: 'location',
          name: provinceName,
          slug: { _type: 'slug', current: slug },
        };
        const res = await this.sanity.create(sanityDoc);

        // 2. Tạo trên Supabase
        await supabase.from('locations').upsert({
          id: res._id,
          slug: slug,
          name: provinceName,
        });

        count++;
      }
      return { success: true, message: `Ohmagod! Đã tạo thành công ${count} tỉnh thành!` };
    } catch (error: any) {
      this.logger.error('Lỗi khi Sync: ', error.message);
      return { success: false, error: error.message };
    }
  }

  async upsertLocation(locationData: Partial<Location>): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('locations')
      .upsert(locationData);

    if (error) {
      this.logger.error('Error upserting location:', error.message);
      throw new Error(error.message);
    }
    return data;
  }

  async deleteById(id: string): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error('Error deleting location:', error.message);
      throw new Error(error.message);
    }
    return data;
  }
}

