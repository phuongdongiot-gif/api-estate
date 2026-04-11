import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Project {
  @Field()
  id: string;

  @Field()
  slug: string;

  @Field()
  name: string;

  // We use GraphQLJSON so the frontend can receive the nested structures exactly as Sanity provides them.
  @Field(() => GraphQLJSON, { nullable: true })
  hero_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  overview_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  values_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  location_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  architecture_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  amenities_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  floorplans_data?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  services_data?: any;
}
