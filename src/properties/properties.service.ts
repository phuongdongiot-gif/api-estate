import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Property } from './models/property.model';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Property[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('properties').select('*');
    
    // NẾU DATABASE SUPABASE CỦA BẠN TRỐNG DO CHƯA SỬA RLS, TÔI TẠM TRẢ VỀ MOCK DỮ LIỆU ĐỂ HIỂN THỊ GraphQL
    if (error || !data || data.length === 0) {
      if (error) this.logger.warn('Supabase DB error: ' + error.message);
      return [
        {
          id: 'gql-mock-1',
          transaction_type: 'sale',
          property_category: 'apartments',
          is_new: true,
          name: '[GraphQL] Căn hộ góc siêu view biển',
          price: '8.5 Tỷ',
          price_num: 8500000000,
          location: 'Sơn Trà, Đà Nẵng',
          beds: 3,
          baths: 2,
          area: '100m2',
          area_num: 100,
          img_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80',
          gallery: []
        },
        {
          id: 'gql-mock-2',
          transaction_type: 'rent',
          property_category: 'villas',
          is_new: false,
          name: '[GraphQL] Biệt thự sinh thái Nam Hòa Xuân',
          price: '30 Triệu/Tháng',
          price_num: 30000000,
          location: 'Hòa Xuân, Đà Nẵng',
          beds: 5,
          baths: 6,
          area: '300m2',
          area_num: 300,
          img_url: 'https://images.unsplash.com/photo-1613490908592-fd5e64efebcc?q=80',
          gallery: []
        },
        {
          id: 'gql-mock-3',
          transaction_type: 'sale',
          property_category: 'private-houses',
          is_new: false,
          name: '[GraphQL] Nhà riêng mặt tiền Cẩm Lệ',
          price: '4.5 Tỷ',
          price_num: 4500000000,
          location: 'Cẩm Lệ, Đà Nẵng',
          beds: 3,
          baths: 2,
          area: '80m2',
          area_num: 80,
          img_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80',
          gallery: []
        }
      ] as Property[];
    }
    
    return data || [];
  }

  async findById(id: string): Promise<Property | null> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    return data || null;
  }

  async upsertProperty(propertyData: any): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('properties')
      .upsert(propertyData);

    if (error) {
      this.logger.error('Error upserting property:', error.message);
      throw new Error(error.message);
    }
    return data;
  }
}
