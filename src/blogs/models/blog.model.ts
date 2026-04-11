import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Blog {
  @Field()
  id: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  img_url?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  content?: any;
}
