import { Resolver, Query, Args } from '@nestjs/graphql';
import { Property } from './models/property.model';
import { PropertiesService } from './properties.service';

@Resolver(() => Property)
export class PropertiesResolver {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Query(() => [Property], { name: 'properties' })
  async getProperties(): Promise<Property[]> {
    return this.propertiesService.findAll();
  }

  @Query(() => Property, { name: 'property', nullable: true })
  async getProperty(@Args('id', { type: () => String }) id: string): Promise<Property | null> {
    return this.propertiesService.findById(id);
  }
}

