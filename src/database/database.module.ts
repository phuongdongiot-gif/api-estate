import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  LocationEntity,
  ProjectEntity,
  ProjectAmenityEntity,
  ProjectFloorplanEntity,
  PropertyEntity,
  BlogEntity,
} from './entities';

const entities = [
  LocationEntity,
  ProjectEntity,
  ProjectAmenityEntity,
  ProjectFloorplanEntity,
  PropertyEntity,
  BlogEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
        entities,
        synchronize: true, // Auto-create schema từ entities (dev mode)
        ssl: { rejectUnauthorized: false }, // Bắt buộc cho Neon
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
  ],
})
export class DatabaseModule {}
