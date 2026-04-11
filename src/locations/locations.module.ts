import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import { LocationsController } from './locations.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [LocationsService, LocationsResolver],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
