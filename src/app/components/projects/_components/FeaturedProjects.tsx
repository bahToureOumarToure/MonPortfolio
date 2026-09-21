"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProjectCard from "../project-card";
import type { ProjectVM } from "@/lib/content-types";

const FeaturedProjects = ({ projects }: { projects: ProjectVM[] }) => {
  return (
    <section id="projects">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full "
      >
        <CarouselContent>
          {projects.map((project, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <ProjectCard key={project.id} project={project} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-black hidden md:flex" />
        <CarouselNext className="text-black hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default FeaturedProjects;
