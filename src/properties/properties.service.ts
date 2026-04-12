import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Property } from './models/property.model';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(private readonly supabaseService: SupabaseService) { }

  async findAll(): Promise<Property[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('properties').select('*');

    if (error) {
      this.logger.error('Supabase DB error: ' + error.message);
      return [];
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

  async upsertProperty(propertyData: Partial<Property>): Promise<any> {
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

  async deleteById(id: string): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error('Error deleting property:', error.message);
      throw new Error(error.message);
    }
    return data;
  }
}
