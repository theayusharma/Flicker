"use client"

import { useState } from "react"
import { useAppSelector } from "../redux"
import { useGetProjectsQuery } from "../reduxstate/api"
import Header from "@/components/Header"
import { PlusSquare } from "lucide-react"
import ModalNewProject from "./ModalNewPro"
import ProjectCard from "@/components/ProjectCard"
import { dummyProjects } from "@/lib/dummyData"
import { useSession } from "next-auth/react"

const ProjectsPage = () => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false)
  const { data: session, status } = useSession()

  const { data: projects, isLoading: isProjectsLoading, error: projectsError } = useGetProjectsQuery()

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const isAuthenticated = status === "authenticated" && session

  const displayProjects = isAuthenticated
    ? (projects || [])
    : dummyProjects

  if (isProjectsLoading) return <div>Loading...</div>

  if (isAuthenticated && projectsError && 'data' in projectsError && projectsError.data &&
    typeof projectsError.data === 'object' && 'message' in projectsError.data) {
    return <div>Access denied to projects</div>
  }

  return (
    <div className="flex flex-col h-full w-full bg-transparent p-8">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      <div className="flex items-center justify-between mb-6">
        <Header name="Projects" />
        <button
          onClick={() => setIsModalNewProjectOpen(true)}
          className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <PlusSquare className="mr-2 w-5 h-5" />
          Create New Project
        </button>
      </div>

      {displayProjects.length === 0 ? (
        <div className="text-center space-y-4 mt-12 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
            <PlusSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            No projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Get started by creating your first project
          </p>
          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <PlusSquare className="mr-2 w-5 h-5" />
            Create New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <ProjectCard key={project.ID} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
