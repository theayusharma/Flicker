// @ts-nocheck
"use client"
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { useAppSelector } from "../redux"
import { useGetUsersQuery, User } from "../reduxstate/api"
import Header from "@/components/Header"
import { collectMeta } from "next/dist/build/utils"
import Image from "next/image"
import { dataGridCN, dataGridSx } from "../lib/utils"
import { dummyUsers } from "@/lib/dummyData"
import { useSession } from "next-auth/react"

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
)


type Props = {
  user: User
}



const columns: GridColDef[] = [
  {
    field: "UserID", headerName: "ID", width: 100
  },
  {
    field: "Username", headerName: "Username", width: 100
  },
  {
    field: "ProfilePictureURL", headerName: "Profile Picture", width: 100, renderCell: (params) => (
      <div className="flex size-full items-center justify-center">
        <div className="size-10">
          <Image
            src={params.row.profile_picture_url || params.row.ProfilePictureURL || "/cat1.png"}
            alt={params.row.username || params.row.Username || "User profile picture"}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    )
  }
]
const Users = () => {
  const { data: session, status } = useSession()
  const { data: user, isLoading, isError } = useGetUsersQuery()

  const isAuthenticated = status === "authenticated" && session
  const hasRealUsers = user && user.length > 0

  const displayUsers = isAuthenticated 
    ? (hasRealUsers ? user : []) 
    : dummyUsers

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  if (isLoading) return <div>Loading...</div>
  if (isError && (!user || user.length === 0)) {
    return (
      <div className="flex w-full flex-col p-8">
        <Header name="Users" />
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={displayUsers || []}
            columns={columns}
            getRowId={(row) => row.UserId}
            pagination
            slots={{
              toolbar: CustomToolbar,
            }}
            className={dataGridCN}
            sx={dataGridSx(isDarkMode)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={displayUsers || []}
          columns={columns}
          getRowId={(row) => row.user_id || row.UserId}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridCN}
          sx={dataGridSx(isDarkMode)}
        />
      </div>
    </div >
  )
}

export default Users
