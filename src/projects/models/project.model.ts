import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Location } from '../../locations/models/location.model';

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

  @Field({ nullable: true })
  hero_img?: string;

  @Field({ nullable: true })
  overview_title?: string;

  @Field({ nullable: true })
  overview_desc?: string;

  // Xoá JSONB cũ, Dùng thẳng Relationship Relational Database 
  @Field(() => Location, { nullable: true })
  location?: Location;

  @Field(() => [ProjectAmenity], { nullable: true, defaultValue: [] })
  amenities?: ProjectAmenity[];

  @Field(() => [ProjectFloorplan], { nullable: true, defaultValue: [] })
  floorplans?: ProjectFloorplan[];
}
