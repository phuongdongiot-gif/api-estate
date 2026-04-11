import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesResolver } from './properties.resolver';
import { PropertiesService } from './properties.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertiesResolver],
})
export class PropertiesModule {}

