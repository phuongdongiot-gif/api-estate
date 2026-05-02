import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { PropertiesResolver } from './properties.resolver';
import { PropertiesService } from './properties.service';
import { PropertyEntity } from '../database/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity])],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertiesResolver],
})
export class PropertiesModule {}
