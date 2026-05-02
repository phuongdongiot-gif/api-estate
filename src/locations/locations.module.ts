import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import { LocationsController } from './locations.controller';
import { LocationEntity } from '../database/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationsService, LocationsResolver],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
