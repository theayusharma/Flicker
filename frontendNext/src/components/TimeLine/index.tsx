// @ts-nocheck
import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/app/reduxstate/api";
import React, { useMemo, useState } from "react"
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react"
import { previousMonday } from "date-fns";
import "gantt-task-react/dist/index.css"
import { dummyProjects, dummyTasksWithUsers } from "@/lib/dummyData";
import { useSession } from "next-auth/react";
type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void
}

type TaskTypeItems = "task" | "milestone" | "project"

const TimeLine = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const { data: session, status } = useSession()

  const [displayOp, setDisplayOp] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US"
  })

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOp((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }))
  }

  const { data: tasks, error, isLoading } = useGetTasksQuery({
    projectId: Number(id)
  })

  const isAuthenticated = status === "authenticated" && session
  const hasRealTasks = tasks && tasks.length > 0

  const displayTasks = isAuthenticated 
    ? (hasRealTasks ? tasks : []) 
    : dummyTasksWithUsers

  const ganttTasks = useMemo(() => {
    return (
      displayTasks?.map((task) => ({
        start: new Date(task.startdate || task.StartDate as string),
        end: new Date(task.duedate || task.DueDate as string),
        name: task.title || task.Title,
        id: task.id,
        type: "task" as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    )
  }, [displayTasks])

  if (isLoading) return <div>Loading...</div>;
  if (error && (!tasks || tasks.length === 0)) {
    return (
      <div className="px-4 xl:px-6">
        <div className="flex items-center justify-between px-4 py-5">
          <h1 className="me-2 text-lg font-bold dark:text-white">Timeline</h1>
          <div className="relative inline-block w-64">
            <select
              className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
              value={displayOp.viewMode}
              onChange={handleViewModeChange}
            >
              <option value={ViewMode.Day}>Day</option>
              <option value={ViewMode.Week}>Week</option>
              <option value={ViewMode.Month}>Month</option>
            </select>
          </div>
        </div>
        <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
          <div className="timeline">
            <Gantt
              tasks={ganttTasks}
              {...displayOp}
              columnWidth={displayOp.viewMode === ViewMode.Month ? 150 : 100}
              listCellWidth="100px"
              projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
              projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
              projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Tasks Timeline
        </h1>
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
      </div>
      <div className="overflow-hidden rounded-md bg-white dark:bg-zinc-900 darl:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOp}
            columnWidth={displayOp.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"} />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-cyan-500 px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >

          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeLine
