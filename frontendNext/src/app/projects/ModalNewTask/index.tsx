import { Priority, Status, useCreateTaskMutation } from "@/app/reduxstate/api";
import Modal from "@/components/Modal";
import { useState } from "react";
import { formatISO } from "date-fns";
import { Upload, X, Image as ImageIcon, File } from "lucide-react";
import Image from "next/image";

type Props = {
  isOpen: boolean,
  onClose: () => void;
  id?: string | null;
}

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [Title, setTitle] = useState("")
  const [status, setStatus] = useState<Status>(Status.todo)
  const [Description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>(Priority.medium)
  const [Tags, setTags] = useState("")
  const [StartDate, setStartDate] = useState("")
  const [DueDate, setDueDate] = useState("")
  const [AuthorUserId, setAuthorUserId] = useState("")
  const [AssignedUserId, setAssignedUserId] = useState("")
  const [ProjectId, setProjectId] = useState("")
  const [points, setPoints] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files])
      
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setAttachmentPreviews(prev => [...prev, e.target?.result as string])
          }
          reader.readAsDataURL(file)
        } else {
          setAttachmentPreviews(prev => [...prev, ''])
        }
      })
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStatus(Status.todo)
    setPriority(Priority.medium)
    setTags("")
    setStartDate("")
    setDueDate("")
    setAuthorUserId("")
    setAssignedUserId("")
    setProjectId("")
    setPoints("")
    setAttachments([])
    setAttachmentPreviews([])
  }
  const handleSubmit = async () => {
    if (!Title) return

    const fStartDate = StartDate ? formatISO(new Date(StartDate), { representation: 'complete' }) : ""
    const fDueDate = DueDate ? formatISO(new Date(DueDate), { representation: 'complete' }) : ""
    
    try {
      await createTask({
        title: Title,
        description: Description,
        status,
        priority,
        tags: Tags,
        startdate: fStartDate,
        duedate: fDueDate,
        points: points ? parseInt(points) : undefined,
        authorid: AuthorUserId ? parseInt(AuthorUserId) : undefined,
        assigneeid: AssignedUserId ? parseInt(AssignedUserId) : undefined,
        projectid: Number(id || ProjectId)
      }).unwrap()

      resetForm()
      onClose()
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }
  
  const isFormValid = () => {
    return Title && Title.trim().length > 0;
  };

  const selectCss = "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:outline-none focus:ring-2 focus:ring-emerald-500"
  const inputCss = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:outline-none focus:ring-2 focus:ring-emerald-500"
  const labelCss = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div>
          <label className={labelCss}>
            Task Title
          </label>
          <input 
            type="text" 
            className={inputCss} 
            placeholder="Enter task title" 
            value={Title}
            onChange={(e) => setTitle(e.target.value)} 
            required
          />
        </div>

        <div>
          <label className={labelCss}>
            Description
          </label>
          <textarea 
            className={`${inputCss} min-h-[100px]`} 
            placeholder="Describe the task in detail..."
            value={Description}
            onChange={(e) => setDescription(e.target.value)} 
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCss}>Priority</label>
            <select 
              className={selectCss}
              value={priority} 
              onChange={(e) => setPriority(Priority[e.target.value as keyof typeof Priority])}
            >
              <option value={Priority.urgent}>Urgent</option>
              <option value={Priority.high}>High</option>
              <option value={Priority.medium}>Medium</option>
              <option value={Priority.low}>Low</option>
              <option value={Priority.backlog}>Backlog</option>
            </select>
          </div>

          <div>
            <label className={labelCss}>Status</label>
            <select
              className={selectCss}
              value={status}
              onChange={(e) => setStatus(Status[e.target.value as keyof typeof Status])}
            >
              <option value={Status.todo}>To Do</option>
              <option value={Status.in_progress}>In Progress</option>
              <option value={Status.review}>Under Review</option>
              <option value={Status.done}>Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCss}>Start Date</label>
            <input 
              type="date" 
              className={inputCss} 
              value={StartDate}
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          
          <div>
            <label className={labelCss}>Due Date</label>
            <input 
              type="date" 
              className={inputCss} 
              value={DueDate}
              onChange={(e) => setDueDate(e.target.value)} 
            />
          </div>

          <div>
            <label className={labelCss}>Story Points</label>
            <input 
              type="number" 
              className={inputCss} 
              placeholder="1, 2, 3, 5, 8, 13..." 
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className={labelCss}>
            Tags
          </label>
          <input 
            type="text" 
            className={inputCss} 
            placeholder="frontend, bug-fix, ui, api (comma separated)" 
            value={Tags}
            onChange={(e) => setTags(e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCss}>Author User ID</label>
            <input 
              type="number" 
              className={inputCss} 
              placeholder="Enter author ID" 
              value={AuthorUserId}
              onChange={(e) => setAuthorUserId(e.target.value)} 
            />
          </div>

          <div>
            <label className={labelCss}>Assigned User ID</label>
            <input 
              type="number" 
              className={inputCss} 
              placeholder="Enter assignee ID" 
              value={AssignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)} 
            />
          </div>
        </div>

        {id === null && (
          <div>
            <label className={labelCss}>Project ID</label>
            <input
              type="number"
              className={inputCss}
              placeholder="Enter project ID"
              value={ProjectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCss}>Start Date</label>
            <input 
              type="date" 
              className={inputCss} 
              value={StartDate}
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>

          <div>
            <label className={labelCss}>Due Date</label>
            <input 
              type="date" 
              className={inputCss} 
              value={DueDate}
              onChange={(e) => setDueDate(e.target.value)} 
            />
          </div>
        </div>

        <div>
          <label className={labelCss}>Tags</label>
          <input 
            type="text" 
            className={inputCss} 
            placeholder="Comma-separated tags" 
            value={Tags}
            onChange={(e) => setTags(e.target.value)} 
          />
        </div>

        <div>
          <label className={labelCss}>
            Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-4">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Drop files here or click to upload
                  </span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Images, PDFs, Documents up to 10MB each
              </p>
            </div>
          </div>

       

          {attachments.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {attachments.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg border border-gray-200 dark:border-zinc-600 p-2 flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                    {attachmentPreviews[index] ? (
                      <Image 
                        src={attachmentPreviews[index]} 
                        alt={file.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-center">
                        <File className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate text-center">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit"
          className={`mt-6 flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating Task..." : "Create Task"}
        </button>
      </form>
    </Modal>
  )
}
export default ModalNewTask 
