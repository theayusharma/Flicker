import { Task, useGetTasksQuery } from "@/app/reduxstate/api";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import React from "react"
import { dataGridCN, dataGridSx } from "@/app/lib/utils";
import { dummyTasksWithUsers } from "@/lib/dummyData";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/app/redux";


type ListProps = {
  id: number;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({ id, setIsModalNewTaskOpen }: ListProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: session, status } = useSession()

  const { data: tasks, isLoading, error } = useGetTasksQuery({
    projectId: Number(id),
  });

  const isAuthenticated = status === "authenticated" && session
  const hasRealTasks = tasks && tasks.length > 0

  const displayTasks = isAuthenticated 
    ? (hasRealTasks ? tasks : []) 
    : dummyTasksWithUsers

  if (isLoading) return <div>Loading...</div>;
  if (error && (!tasks || tasks.length === 0)) {
    return (
      <div className="px-4 pb-6 xl:px-6">
        <div className="pt-5">
          <Header name="List"
            buttonComponent={
              <button
                className="flex items-center bg-emerald-500 text-white hover:bg-emerald-300 rounded p-2"
                onClick={() => setIsModalNewTaskOpen(true)}>
                Add Task
              </button>
            }
            isSmallText
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {displayTasks?.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div
      className="px-4 pb-6 xl:px-6"
    >
      <div className="pt-5">
        <Header name="List"
          buttonComponent={
            <button
              className="flex items-center bg-emerald-500 text-white hover:bg-emerald-300 rounded p-2"
              onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </button>
          }
          isSmallText
        />

      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {displayTasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

export default ListView
