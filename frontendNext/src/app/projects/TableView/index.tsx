import { useGetTasksQuery } from "@/app/reduxstate/api";
import Header from "@/components/Header";
import React from "react"
import { DataGrid, GridColDef } from '@mui/x-data-grid'
/* import { columnsStateInitializer } from "@mui/x-data-grid/internals"; */
import { dataGridCN, dataGridSx } from "@/app/lib/utils";
import { useTheme } from "next-themes";
import { dummyTasksWithUsers } from "@/lib/dummyData";
import { useSession } from "next-auth/react";
type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void
}
const columns: GridColDef[] = [
  {
    field: "Title",
    headerName: "Title",
    width: 100
  },
  {
    field: "Description",
    headerName: "Description",
    width: 200
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800 leading-5">
        {params.value}
      </span>
    )
  },
  {
    field: "Priority",
    headerName: "Priority",
    width: 75
  },
  {
    field: "Tags",
    headerName: "Tags",
    width: 100
  },
  {
    field: "StartDate",
    headerName: "StartDate",
    width: 100
  },
  {
    field: "DueDate",
    headerName: "DueDate",
    width: 100
  },
  {
    field: "Author",
    headerName: "Author",
    width: 130,
    renderCell: (params) => params.value?.Username || "Unknown"
  },
  {
    field: "Assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.Username || "Unknown"
  },
]

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {

  const { theme } = useTheme();
  const { data: session, status } = useSession()
  const { data: tasks, error, isLoading } = useGetTasksQuery({
    projectId: Number(id)
  })

  const isAuthenticated = status === "authenticated" && session
  const hasRealTasks = tasks && tasks.length > 0

  const displayTasks = isAuthenticated 
    ? (hasRealTasks ? tasks : []) 
    : dummyTasksWithUsers

  if (isLoading) return <div>Loading...</div>;
  if (error && (!tasks || tasks.length === 0)) {
    return (
      <div className="h-[540px] w-full pc-4 pb-8 xl:px-6">
        <div className="pt-5">
          <Header name="Table"
            buttonComponent={
              <button
                className="flex items-center bg-emerald-500 text-white hover:bg-blue-600 rounded mx-2 mb-1 p-2"
                onClick={() => setIsModalNewTaskOpen(true)}>
                Add Task
              </button>
            }
            isSmallText
          />
        </div>
        <DataGrid
          rows={displayTasks || []}
          columns={columns}
          className={dataGridCN}
          sx={dataGridSx(theme === "dark" ? true : false)}
        />
      </div>
    )
  }

  return (
    <div className="h-[540px] w-full pc-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header name="Table"
          buttonComponent={
            <button
              className="flex items-center bg-emerald-500 text-white hover:bg-blue-600 rounded mx-2 mb-1 p-2"
              onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <DataGrid
        rows={displayTasks || []}
        columns={columns}
        className={dataGridCN}
        sx={dataGridSx(theme === "dark" ? true : false)}
      />

    </div>
  )
}

export default TableView
