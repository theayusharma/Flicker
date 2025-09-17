"use client"

import { useAppSelector } from "@/app/redux";
import { useGetProjectsQuery, useGetTasksQuery } from "@/app/reduxstate/api";
import React, { useMemo, useState } from "react"
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react"
import { previousMonday } from "date-fns";
import "gantt-task-react/dist/index.css"
import Header from "@/components/Header";
import { dummyProjects } from "@/lib/dummyData";
import { useSession } from "next-auth/react";
type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void
}

type TaskTypeItems = "task" | "milestone" | "project"

const TimeLine = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const { data: session, status } = useSession()

  const { data: projects, isLoading, error } = useGetProjectsQuery()

  const isAuthenticated = status === "authenticated" && session
  const hasRealProjects = projects && projects.length > 0

  const displayProjects = isAuthenticated 
    ? (hasRealProjects ? projects : []) 
    : dummyProjects

  const [displayOp, setDisplayOp] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  })

  

  const ganttProjects = useMemo(() => {
    return (
      displayProjects?.map((project) => {
        const startDate = project?.StartDate ? new Date(project.StartDate) : new Date()
        const endDate = project?.EndDate ? new Date(project.EndDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        
        return {
          start: startDate,
          end: endDate,
          name: project?.Name || 'Untitled Project',
          id: `Project-${project?.ID || Math.random()}`,
          type: "project" as TaskTypeItems,
          description: project?.Description || 'No description available',
          isDisabled: false,
        }
      }) || []
    )
  }, [displayProjects])

  if (isLoading) return <div>Loading...</div>;
  if (error && (!projects || projects.length === 0)) {
    return (
      <div className="max-w-full p-8">
        <header className="mb-4 flex itemes-center justify-between">
          <Header name="Projects Timeline" />
          <div className="relative inline-block w-64">
            <select className="focues:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-white dark:bg-zinc-900 dark:text-white"
              value={displayOp.viewMode}
              onChange={handleViewModeChange}
            >
              <option value={ViewMode.Day}>Day</option>
              <option value={ViewMode.Week}>Week</option>
              <option value={ViewMode.Month}>Month</option>
            </select>
          </div>
        </header>
        <div className="overflow-hidden rounded-md bg-white dark:bg-zinc-900 darl:text-white">
          <div className="timeline">
            {ganttProjects.length > 0 ? (
              <Gantt
                tasks={ganttProjects}
                {...displayOp}
                columnWidth={displayOp.viewMode === ViewMode.Month ? 150 : 100}
                listCellWidth="100px"
                projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
                projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
                projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No Projects Available</h3>
                  <p className="text-sm">Create a project to see it in the timeline view.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOp((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }))
  }
  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex itemes-center justify-between">
        <Header name="Projects Timeline" />
        <div className="relative inline-block w-64">
          <select className="focues:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-white dark:bg-zinc-900 dark:text-white"
            value={displayOp.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>
      <div className="overflow-hidden rounded-md bg-white dark:bg-zinc-900 darl:text-white">
        <div className="timeline">
          {ganttProjects.length > 0 ? (
            <Gantt
              tasks={ganttProjects}
              {...displayOp}
              columnWidth={displayOp.viewMode === ViewMode.Month ? 150 : 100}
              listCellWidth="100px"
              projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
              projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
              projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No Projects Available</h3>
                <p className="text-sm">Create a project to see it in the timeline view.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimeLine
