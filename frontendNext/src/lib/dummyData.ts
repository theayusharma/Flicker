// Dummy data for non-authenticated users
import { Project, Task, User, Team, Priority, Status } from "@/app/reduxstate/api";

export const dummyProjects: Project[] = [
  {
    ID: 1,
    Name: "Sample Project Alpha",
    Description: "This is a sample project to demonstrate the platform capabilities. Login to see your real projects.",
    StartDate: "2024-01-01",
    EndDate: "2024-12-31",
  },
  {
    ID: 2,
    Name: "Demo Marketing Campaign",
    Description: "A marketing campaign project example. Create an account to manage your own projects.",
    StartDate: "2024-02-15",
    EndDate: "2024-06-30",
  },
  {
    ID: 3,
    Name: "Website Redesign Demo",
    Description: "Sample website redesign project. Sign in to access your personal workspace.",
    StartDate: "2024-03-01",
    EndDate: "2024-08-15",
  },
];

export const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Design Homepage Mockup",
    description: "Create wireframes and mockups for the new homepage design. This is sample data - login to see your tasks.",
    status: "todo" as any,
    priority: Priority.high,
    startdate: "2024-01-15",
    duedate: "2024-01-30",
    points: 8,
    projectid: 1,
    authorid: 1,
    assigneeid: 2,
    tags: "design,ui,mockup",
  },
  {
    id: 2,
    title: "Implement Authentication",
    description: "Set up user authentication system with login/logout functionality. Demo task - please login to access real data.",
    status: "in_progress" as any,
    priority: Priority.urgent,
    startdate: "2024-01-20",
    duedate: "2024-02-05",
    points: 13,
    projectid: 1,
    authorid: 2,
    assigneeid: 1,
    tags: "backend,auth,security",
  },
  {
    id: 3,
    title: "Write User Documentation",
    description: "Create comprehensive user guide and API documentation. Sample task for demonstration purposes.",
    status: "review" as any,
    priority: Priority.medium,
    startdate: "2024-02-01",
    duedate: "2024-02-20",
    points: 5,
    projectid: 2,
    authorid: 1,
    assigneeid: 3,
    tags: "documentation,writing",
  },
  {
    id: 4,
    title: "Test Mobile Responsiveness",
    description: "Ensure all components work properly on mobile devices. This is demo content - login for your real tasks.",
    status: "done" as any,
    priority: Priority.low,
    startdate: "2024-01-10",
    duedate: "2024-01-25",
    points: 3,
    projectid: 3,
    authorid: 3,
    assigneeid: 2,
    tags: "testing,mobile,responsive",
  },
];

export const dummyUsers: User[] = [
  {
    UserId: 1,
    Username: "john_doe",
    Email: "john@example.com",
    ProfilePictureURL: "/cat1.png",
    TeamId: 1,
  },
  {
    UserId: 2,
    Username: "jane_smith",
    Email: "jane@example.com", 
    ProfilePictureURL: "/cat2.webp",
    TeamId: 1,
  },
  {
    UserId: 3,
    Username: "demo_user",
    Email: "demo@example.com",
    ProfilePictureURL: "/cat3.webp",
    TeamId: 2,
  },
];

export const dummyTeams: Team[] = [
  {
    teamid: 1,
    teamname: "Development Team",
    product_owner_username: 1,
    project_manager_username: 2,
  },
  {
    teamid: 2,
    teamname: "Marketing Team",
    product_owner_username: 3,
    project_manager_username: 1,
  },
];

// Enhanced dummy tasks with user information
export const dummyTasksWithUsers: Task[] = dummyTasks.map(task => ({
  ...task,
  author: dummyUsers.find(user => user.UserId === task.authorid),
  assignee: dummyUsers.find(user => user.UserId === task.assigneeid),
  comments: [],
  attachments: [],
}));

export const loginPromptMessage = "🔐 You're viewing demo data. Please log in to access your personal workspace and real projects.";

export const dummySearchResults = {
  task: dummyTasks.slice(0, 2),
  project: dummyProjects.slice(0, 2), 
  user: dummyUsers.slice(0, 2),
};