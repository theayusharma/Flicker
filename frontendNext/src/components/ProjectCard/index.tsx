import { Project } from "@/app/reduxstate/api"
import Image from "next/image"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"

type Props = {
  project: Project
}

const ProjectCard = ({ project }: Props) => {
  const fStartDate = project.StartDate ? (() => {
    try {
      const date = new Date(project.StartDate);
      return isNaN(date.getTime()) ? "" : format(date, "P");
    } catch (error) {
      console.error("Error formatting StartDate:", project.StartDate, error);
      return "";
    }
  })() : "";
  
  const fEndDate = project.EndDate ? (() => {
    try {
      const date = new Date(project.EndDate);
      return isNaN(date.getTime()) ? "" : format(date, "P");
    } catch (error) {
      console.error("Error formatting EndDate:", project.EndDate, error);
      return "";
    }
  })() : "";

  const isCompleted = project.EndDate && new Date(project.EndDate) < new Date();

  const StatusTag = ({ completed }: { completed: boolean }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        completed 
          ? "bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-100" 
          : "bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
      }`}
    >
      {completed ? "Completed" : "Active"}
    </div>
  );

  return (
    <div className="mb-4 rounded-md bg-white shadow dark:bg-zinc-900 hover:shadow-lg transition-shadow cursor-pointer">
      <Image
        src="/cat1.png"
        alt="Project"
        width={400}
        height={200}
        className="h-auto w-full rounded-t-md"
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <StatusTag completed={isCompleted || false} />
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-bold dark:text-white mb-2">{project.Name}</h3>
        </div>

        {project.Description && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {project.Description}
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Start: {fStartDate || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>End: {fEndDate || "Not set"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
