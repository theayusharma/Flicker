// @ts-nocheck
import { Task } from "@/app/reduxstate/api"
import React from "react"
import { format } from "date-fns"
import Image from "next/image"
type Props = {
  task: any
}

const TaskCard = ({ task }: Props) => {
  return (
    <div className="mb-3 bg-white p-4 shadow dark:text-white dark:bg-zinc-900 rounded-md">
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <strong>Attachments:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {task.attachments.map((attachment: any, index: number) => (
              <div key={attachment.id || index} className="relative">
                <Image
                  src={attachment.FileURL}
                  alt={attachment.FileName || "Attachment"}
                  width={200}
                  height={120}
                  className="rounded-md object-cover"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {attachment.FileName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p className="mb-2">
        <strong>ID:</strong> {task.id}
      </p>
      <p className="mb-2">
        <strong>Title:</strong> {task.title || task.Title}
      </p>
      <p className="mb-3">
        <strong>Description:</strong> {task.description || task.Description || "No description provided"}
      </p>
      <p className="mb-2">
        <strong>Status:</strong> {task.status || task.Status}
      </p>
      <p className="mb-2">
        <strong>Priority:</strong> {task.priority || task.Priority}
      </p>
      <p className="mb-2">
        <strong>Tags:</strong> {task.tags || task.Tags || "No tags"}
      </p>
      <p className="mb-2">
        <strong>Points:</strong> {task.points || "Not set"}
      </p>
      <p className="mb-2">
        Start Date: {(task.startdate || task.StartDate) ? new Date(task.startdate || task.StartDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }) : "Not set"}
      </p>
      <p className="mb-2">
        Due Date: {(task.duedate || task.EndDate) ? new Date(task.duedate || task.EndDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }) : "Not set"}
      </p>
      <p className="mb-2">
        <strong>Author:</strong> {task.author?.Username || task.Author?.UserName || "Unknown"}
      </p>
      <p className="mb-2">
        <strong>Assignee:</strong> {task.assignee?.Username || task.Assignee?.UserName || "Unassigned"}
      </p>

      {task.comments && task.comments.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <strong>Comments ({task.comments.length}):</strong>
          <div className="mt-2 space-y-2">
            {task.comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 dark:bg-zinc-800 p-2 rounded text-sm">
                <p className="mb-1">{comment.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {comment.userId ? `User ${comment.userId}` : "Anonymous"} • {comment.createdAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard
