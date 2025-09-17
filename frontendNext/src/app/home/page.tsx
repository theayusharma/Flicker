"use client"

import { GridColDef } from "@mui/x-data-grid"
import { useAppSelector } from "../redux"
import { Priority, Project, Task, useGetProjectsQuery, useGetTasksQuery } from "../reduxstate/api"
import Header from "@/components/Header"
import { ResponsiveContainer, BarChart, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";
import { DataGrid } from "@mui/x-data-grid"
import { dataGridCN, dataGridSx } from "../lib/utils"
import { useState } from "react"
import { PlusSquare } from "lucide-react"
import ModalNewProject from "../projects/ModalNewPro"
import { dummyProjects, dummyTasksWithUsers } from "@/lib/dummyData"
import { useSession } from "next-auth/react"

const HomePage = () => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false)
  const { data: session, status } = useSession()

  const { data: projects, isLoading: isProjectsLoading, error: projectsError } = useGetProjectsQuery()

  const firstProjectId = projects && projects.length > 0 ? projects[0].ID : null

  const { data: tasks, isLoading: taskLoading, isError: tasksError } = useGetTasksQuery(
    { projectId: firstProjectId! },
    { skip: !firstProjectId }
  )

  const dummyProjectsData = dummyProjects
  const dummyTasksData = dummyTasksWithUsers

  const isAuthenticated = status === "authenticated" && session
  const hasRealProjects = projects && projects.length > 0

  const displayProjects = isAuthenticated
    ? (projects || [])
    : dummyProjectsData

  const hasRealTasks = tasks && tasks.length > 0

  const displayTasks = isAuthenticated
    ? (hasRealTasks ? tasks : [])
    : dummyTasksData

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  if (isProjectsLoading) return <div>Loading...</div>

  if (isAuthenticated && projectsError && 'data' in projectsError && projectsError.data &&
    typeof projectsError.data === 'object' && 'message' in projectsError.data) {
    return <div>Access denied to this project</div>
  }

  const priorityCount = (displayTasks || []).reduce((acc: Record<string, number>, task: Task) => {
    const priority = task?.priority || task?.Priority || "low"
    acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
    return acc;
  }, {})

  const taskDistri = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key]
  }))

  const statusCount = displayProjects.reduce((acc: Record<string, number>, project: Project) => {
    const status = project?.EndDate ? "Completed" : "Active"
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {})

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key]
  }))

  const taskCols: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200, valueGetter: (params) => params.row?.title || params.row?.Title || '' },
    { field: "status", headerName: "Status", width: 150, valueGetter: (params) => params.row?.status || params.row?.Status || '' },
    { field: "priority", headerName: "Priority", width: 150, valueGetter: (params) => params.row?.priority || params.row?.Priority || '' },
    { field: "duedate", headerName: "Due Date", width: 150, valueGetter: (params) => params.row?.duedate || params.row?.DueDate || '' },
  ];

  const Colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const chartColors = isDarkMode
    ? {
      bar: "#8884d8",
      barGrid: "#303030",
      pieFill: "#4A90E2",
      text: "#FFFFFF",
    }
    : {
      bar: "#8884d8",
      barGrid: "#E0E0E0",
      pieFill: "#82ca9d",
      text: "#000000",
    };

  return (
    <div className="flex flex-col h-full w-full bg-transparent p-8">
      <div className="mb-8">
        <ModalNewProject
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />

        <div className="text-center space-y-4 mb-8 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
            <PlusSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <button
            onClick={() => setIsModalNewProjectOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <PlusSquare className="mr-2 w-5 h-5" />
            Create New Project
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAuthenticated 
              ? (displayProjects.length > 0 ? 'Your Projects' : 'No Projects Yet') 
              : 'Sample Projects'
            }
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {displayProjects.map((project) => (
            <div
              key={project.ID}
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/projects/${project.ID}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {project.Name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${project.EndDate
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                  {project.EndDate ? 'Completed' : 'Active'}
                </span>
              </div>

              {project.Description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {project.Description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                {project.StartDate && (
                  <span>Started: {new Date(project.StartDate).toLocaleDateString()}</span>
                )}
                {project.EndDate && (
                  <span>Due: {new Date(project.EndDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      <Header name="Dashboard Analytics" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 ">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-zinc-500">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Tasks Priority Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300} >
              <BarChart data={taskDistri}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
                <XAxis dataKey="name" stroke={chartColors.text} />
                <YAxis stroke={chartColors.text} />
                <Tooltip contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }} />
                <Legend />
                <Bar dataKey="count" fill={chartColors.bar} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-zinc-500 w-min-400">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Priority Status
            </h3>
            <ResponsiveContainer width="100%" height={300} >
              <PieChart>
                <Pie dataKey="count" data={projectStatus} label fill="#82ca9d" />
                {projectStatus.map((name, idx) => {
                  <Cell key={`cell-${idx}`} fill={Colors[idx % Colors.length]} />
                })}

                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={chartColors.bar} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-zinc-500">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Your Tasks
            </h3>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={displayTasks || []}
                columns={taskCols}
                checkboxSelection
                loading={taskLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-col"}
                className={dataGridCN}
                sx={dataGridSx(isDarkMode)}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HomePage 
