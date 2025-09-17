// @ts-nocheck
import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/app/reduxstate/api";
import React from "react"
import { DndProvider, useDrop, useDrag } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Task as TaskType } from "@/app/reduxstate/api"
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { dummyTasksWithUsers } from "@/lib/dummyData";
import { useSession } from "next-auth/react";

type BoardProps = {
  id: number;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const statusMapping = {
  "todo": "To Do",
  "in_progress": "Work In Progress",
  "review": "Under Review",
  "completed": "Completed"
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const Boardview = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const { data: session, status } = useSession()

  const moveTask = (taskId: number, toStatus: string) => {
    const backendStatus = Object.keys(statusMapping).find(
      key => statusMapping[key as keyof typeof statusMapping] === toStatus
    ) || toStatus.toLowerCase().replace(/\s+/g, '');

    updateTaskStatus({ taskId, status: backendStatus });
  }

  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });

  const isAuthenticated = status === "authenticated" && session
  const hasRealTasks = tasks && tasks.length > 0

  const displayTasks = isAuthenticated 
    ? (hasRealTasks ? tasks : []) 
    : dummyTasksWithUsers

  if (isLoading) return <div>Loading...</div>;
  if (error && (!tasks || tasks.length === 0)) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          {taskStatus.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={displayTasks || []}
              moveTask={moveTask}
              setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            />
          ))}
        </div>
      </DndProvider>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={displayTasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const getBackendStatus = (frontendStatus: string) => {
    return Object.keys(statusMapping).find(
      key => statusMapping[key as keyof typeof statusMapping] === frontendStatus
    ) || frontendStatus.toLowerCase().replace(/\s+/g, '');
  };

  const filteredTasks = tasks.filter((task: any) => {
    const backendStatus = getBackendStatus(status);
    return task.status === backendStatus;
  });

  const taskCount = filteredTasks.length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    "Completed": "#000000"
  };

  return (
    <div ref={(instance) => {
      drop(instance);
    }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? " bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-zinc-900">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{"  "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 dark:bg-blue-200 dark:text-black p-1 text-center text-sm leading-none dark:bg-dark-tertiary "
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {taskCount}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button className="flex size-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex size-5 items-center justify-center dark:text-neutral-500"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
      </div>
      {filteredTasks.map((task: any) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

type TaskProps = {
  task: any;
}

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.Tags ? task.Tags.split(",") : [];
  const fStartDate = task.StartDate ? (() => {
    try {
      const date = new Date(task.StartDate);
      return isNaN(date.getTime()) ? "" : format(date, "P");
    } catch (error) {
      console.error("Error formatting StartDate:", task.StartDate, error);
      return "";
    }
  })() : ""; // const fStartDate = task.StartDate ? format(new Date(task.StartDate), "P") : "";
  const fDueDate = task.DueDate ? format(new Date(task.DueDate), "P") : "";
  const noOfcomments = 0;

  const PriorityTag = ({ priority }: { priority: string | null }) => {
    if (!priority) return null;

    return (
      <div
        className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === "Urgent" ? "bg-red-200 text-red-700" :
          priority === "High" ? "bg-yellow-200 text-yellow-700" :
            priority === "Medium" ? "bg-green-200 text-green-700" :
              priority === "Low" ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-700"
          }`}
      >
        {priority}
      </div>
    );
  };

  return (
    <div ref={(instance) => {
      drag(instance)
    }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-zinc-900 ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      {task.attachments?.length ? (
        <Image
          src={task.attachments[0].FileURL}
          alt={task.attachments[0].FileName || "Default image"}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      ) : (
        <Image
          src="/cat1.png"
          alt="Default"
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.Priority && <PriorityTag priority={task.Priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag: string) => (
                <div key={tag} className="rounded-full bg-blue-100 px-2 py-1 text-xs dark:bg-blue-500">
                  {tag.trim()}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.Title}</h4>
        </div>

        {task.Description && (
          <div className="text-xs text-gray-500 dark:text-gray-300">
            {task.Description}
          </div>
        )}
        {/*userssssss*/}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden ">
            {task.Assignee && (
              <Image
                key={task.Assignee.UserId}
                src={`${task.Assignee.ProfilePictureURL}`}
                alt={task.Assignee.Username}
                width={30}
                height={30}
                className="sm:size-12 size-10 rounded-full border-2 border-white object-cover dark:border-dark-secondary w-full"
              />
            )}
          </div>
        </div>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        <div className="mt-3 flex items-center justify-between text-xs text-gray-700 dark:text-gray-100">
          <div>{fStartDate}</div>
          <div className="flex items-center gap-2">
            {fStartDate && <span>Start: {fStartDate}</span>}
            {fDueDate && <span>Due: {fDueDate}</span>}
          </div>
          <div className="flex items-center gap-2">
            <MessageSquareMore size={20} />
            <span>{noOfcomments}</span>

          </div>
        </div>
        {/* <div className="dark:bg-dark-tertiary m-2 p-2 bg-amber-600"> */}
        {/*   hjfdsf */}
        {/**/}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Boardview;
