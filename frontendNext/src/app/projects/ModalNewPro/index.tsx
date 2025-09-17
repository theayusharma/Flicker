import { useCreateProjectMutation } from "@/app/reduxstate/api";
import Modal from "@/components/Modal";
import { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean,
  onClose: () => void;
}

const ModalNewProject = ({
  isOpen, onClose
}: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation()
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [category, setCategory] = useState("Web Development")
  const [teamSize, setTeamSize] = useState("")
  const [budget, setBudget] = useState("")

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    const fStartDate = formatISO(new Date(startDate), { representation: 'complete' })
    const fEndDate = formatISO(new Date(endDate), { representation: 'complete' })
    
    try {
      await createProject({
        name: projectName,
        description: description,
        startdate: fStartDate,
        enddate: fEndDate,
      }).unwrap()

      setProjectName("")
      setDescription("")
      setStartDate("")
      setEndDate("")
      setPriority("Medium")
      setCategory("Web Development")
      setTeamSize("")
      setBudget("")
      onClose()
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  }

  const inputCss = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-gray-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
  const selectCss = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-gray-600 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Name *
          </label>
          <input 
            type="text" 
            className={inputCss} 
            placeholder="Enter project name" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea 
            className={inputCss} 
            placeholder="Describe your project" 
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date *
            </label>
            <input 
              type="date" 
              className={inputCss} 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date *
            </label>
            <input 
              type="date" 
              className={inputCss} 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select 
              className={selectCss} 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select 
              className={selectCss} 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Desktop Software">Desktop Software</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
              <option value="Research">Research</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Size
            </label>
            <input 
              type="number" 
              className={inputCss} 
              placeholder="Expected team size" 
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Budget (Optional)
            </label>
            <input 
              type="text" 
              className={inputCss} 
              placeholder="e.g., $10,000" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)} 
            />
          </div>
        </div>

        <button 
          type="submit"
          className={`mt-6 flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  )
}

export default ModalNewProject
