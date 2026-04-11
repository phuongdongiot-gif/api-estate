import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { PropertiesModule } from './properties/properties.module';
import { BlogsModule } from './blogs/blogs.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.VERCEL ? true : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Hiển thị giao diện Playground
      introspection: true, // CHo phép Playground tải Schema Docs ở Production
    }),
    SupabaseModule,
    PropertiesModule,
    BlogsModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

