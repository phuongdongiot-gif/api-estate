import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { PropertiesModule } from './properties/properties.module';
import { BlogsModule } from './blogs/blogs.module';
import { ProjectsModule } from './projects/projects.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LocationsModule } from './locations/locations.module';

import { UpstashRedisCache } from './upstash.cache';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.VERCEL ? true : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false, // Tắt giao diện cũ
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Bật giao diện Apollo Sandbox hiện đại cực đẹp
      introspection: true, // Cho phép Sandbox tải Schema Docs ở Production
      cache: new UpstashRedisCache(), // Thêm dòng này để kết nối Upstash
    }),
    SupabaseModule,
    PropertiesModule,
    BlogsModule,
    ProjectsModule,
    CloudinaryModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

