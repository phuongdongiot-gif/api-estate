import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Location } from './models/location.model';
import axios from 'axios';
import { createClient } from '@sanity/client';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  private sanity: any;

  constructor(private readonly supabaseService: SupabaseService) {
    this.sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || 'production',
      token: process.env.SANITY_TOKEN,
      useCdn: false,
      apiVersion: '2024-04-11',
    });
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
}
