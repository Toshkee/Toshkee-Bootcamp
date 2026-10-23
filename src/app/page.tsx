import { Dashboard, type ProjectCard } from "@/components/dashboard/dashboard";
import { allLessons, projectInfo } from "@/content/curriculum";
import type { ProjectId } from "@/content/types";
import { getNav } from "@/lib/nav";

export default function Home() {
  const projects: ProjectCard[] = (Object.keys(projectInfo) as ProjectId[])
    .map((id) => ({
      id,
      ...projectInfo[id],
      lessons: allLessons.filter((l) => l.lesson.projects.includes(id)).length,
    }))
    .sort((a, b) => b.lessons - a.lessons);
  return <Dashboard nav={getNav()} projects={projects} />;
}
