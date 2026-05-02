import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Location } from '../../locations/models/location.model';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class ProjectAmenity {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image_url?: string;
}

@ObjectType()
export class ProjectFloorplan {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  area?: string;

  @Field(() => Int, { nullable: true })
  beds?: number;

  @Field(() => Int, { nullable: true })
  baths?: number;

  @Field({ nullable: true })
  image_url?: string;
}

@ObjectType()
export class Project {
  @Field()
  id: string;

  @Field()
  slug: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  hero_title?: string;

  @Field({ nullable: true })
  hero_desc?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  hero_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  overview_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  values_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  location_data?: any;

  @Field(() => Number, { nullable: true })
  lat?: number;

  @Field(() => Number, { nullable: true })
  lng?: number;

  // Xoá JSONB cũ, Dùng thẳng Relationship Relational Database 
  @Field(() => Location, { nullable: true })
  location?: Location;

  @Field(() => [ProjectAmenity], { nullable: true, defaultValue: [] })
  amenities?: ProjectAmenity[];

  @Field(() => [ProjectFloorplan], { nullable: true, defaultValue: [] })
  floorplans?: ProjectFloorplan[];
}
