import { Resolver, Query, Args } from '@nestjs/graphql';
import { Project } from './models/project.model';
import { ProjectsService } from './projects.service';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { name: 'projects' })
  async getProjects(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Query(() => Project, { name: 'project', nullable: true })
  async getProject(@Args('slug', { type: () => String }) slug: string): Promise<Project | null> {
    return this.projectsService.findBySlug(slug);
  }
}
