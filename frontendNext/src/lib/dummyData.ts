import { Project, Task, User, Team, Priority, Status } from "@/app/reduxstate/api";

export const dummyProjects: Project[] = [
  {
    ID: 1,
    Name: "Cat Cafe Management System",
    Description: "A comprehensive platform to manage our cozy cat cafe with reservation tracking, cat adoption services, and purr-fect customer experience features.",
    StartDate: "2024-01-15",
    EndDate: "2024-06-30",
  },
  {
    ID: 2,
    Name: "Feline Health Tracker App",
    Description: "Mobile application for cat parents to track their kitty's health records, vaccination schedules, and vet appointments with whisker-precise accuracy.",
    StartDate: "2024-02-01",
    EndDate: "2024-08-15",
  },
  {
    ID: 3,
    Name: "Premium Cat Toy E-commerce",
    Description: "Online marketplace featuring the finest selection of cat toys, scratching posts, and interactive play equipment that will make every cat purr with joy.",
    StartDate: "2024-03-10",
    EndDate: "2024-12-20",
  },
];

export const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Cat Profile Cards",
    description: "Create irresistibly adorable profile cards for each cafe cat featuring their whisker-perfect photos",
    status: "in_progress" as any,
    priority: Priority.high,
    startdate: "2024-01-20",
    duedate: "2024-02-15",
    points: 13,
    projectid: 1,
    authorid: 1,
    assigneeid: 2,
    tags: "design,ui,cats,profiles",
    createdat: Date.now() - 86400000 * 5, 
    updatedat: Date.now() - 3600000 * 2, 
  },
  {
    id: 2,
    title: "Purr & Ambient Meow Effects",
    description: "Add soothing purr sound effects and gentle meow ambiance throughout the reservation system to create a zen-like atmosphere that makes customers feel like they're already cuddling with fluffy cats.",
    status: "todo" as any,
    priority: Priority.medium,
    startdate: "2024-02-10",
    duedate: "2024-02-25",
    points: 8,
    projectid: 1,
    authorid: 2,
    assigneeid: 3,
    tags: "audio,frontend,ambiance,purr",
    createdat: Date.now() - 86400000 * 3, 
    updatedat: Date.now() - 3600000 * 6, 
  },
  {
    id: 3,
    title: "AI-Powered Whisker Recognition",
    description: "Develop a revolutionary AI system that identifies individual cats by their unique whisker patterns while simultaneously analyzing their mood through facial expressions, tail position, ear ",
    status: "in_progress" as any,
    priority: Priority.urgent,
    startdate: "2024-02-15",
    duedate: "2024-03-15",
    points: 21,
    projectid: 2,
    authorid: 1,
    assigneeid: 1,
    tags: "ai,machine-learning,computer-vision",
    createdat: Date.now() - 86400000 * 8, // 8 days ago
    updatedat: Date.now() - 3600000 * 1, // 1 hour ago
  },
];

export const dummyComments = [
  {
    id: 1,
    text: "Great cat profile cards! Love the cattitude meter.",
    userId: 2,
    taskId: 1,
    createdAt: "2024-02-10"
  },
  {
    id: 2,
    text: "Add biscuit making skill indicator and zoomies chart?",
    userId: 1,
    taskId: 1,
    createdAt: "2024-02-11"
  },
  {
    id: 3,
    text: "Whisker recognition at 99.9% accuracy! Pre-zoomies detection works.",
    userId: 1,
    taskId: 3,
    createdAt: "2024-02-14"
  },
  {
    id: 4,
    text: "AI predicted Princess Fluffington's stare mode perfectly!",
    userId: 3,
    taskId: 3,
    createdAt: "2024-02-16"
  },
  {
    id: 5,
    text: "Love the purr soundscape! Winter fireplace combo is relaxing.",
    userId: 2,
    taskId: 2,
    createdAt: "2024-02-12"
  },
  {
    id: 6,
    text: "Maine Coon purr level 7 is perfect! Add chorus mode?",
    userId: 1,
    taskId: 2,
    createdAt: "2024-02-13"
  }
];

export const dummyAttachments = [
  {
    id: 1,
    FileURL: "/cat1.png",
    FileName: "cat_profile_mockup_v3.png",
    taskId: 1,
    uploadedId: 2
  },
  {
    id: 2,
    FileURL: "/cat2.webp", 
    FileName: "purr-sonality_card_template.webp",
    taskId: 1,
    uploadedId: 1
  },
  {
    id: 3,
    FileURL: "/cat3.webp",
    FileName: "cattitude_meter_design.webp", 
    taskId: 1,
    uploadedId: 2
  },
  {
    id: 4,
    FileURL: "/cat4.webp",
    FileName: "fluffiness_rating_scale.webp",
    taskId: 1,
    uploadedId: 1
  },
  {
    id: 5,
    FileURL: "/cat5.webp",
    FileName: "whisker_pattern_analysis_v2.webp",
    taskId: 3,
    uploadedId: 1
  },
  {
    id: 6,
    FileURL: "/cat6.webp",
    FileName: "ai_mood_detection_demo.webp",
    taskId: 3,
    uploadedId: 3
  },
  {
    id: 7,
    FileURL: "/logo.webp",
    FileName: "purr_soundscape_waveforms.webp",
    taskId: 2,
    uploadedId: 2
  }
];

export const dummyUsers: User[] = [
  {
    UserId: 1,
    Username: "whisker_wizard",
    Email: "whiskers@catcafe.com",
    ProfilePictureURL: "/cat1.png",
    TeamId: 1,
  },
  {
    UserId: 2,
    Username: "purr_designer",
    Email: "purrfect@catcafe.com", 
    ProfilePictureURL: "/cat2.webp",
    TeamId: 1,
  },
  {
    UserId: 3,
    Username: "meow_developer",
    Email: "meowster@catcafe.com",
    ProfilePictureURL: "/cat3.webp",
    TeamId: 2,
  },
  {
    UserId: 4,
    Username: "fluffy_analyst",
    Email: "fluffy@catcafe.com",
    ProfilePictureURL: "/cat4.webp",
    TeamId: 1,
  },
];

export const dummyTeams: Team[] = [
  {
    teamid: 1,
    teamname: "Purr-fect Development Pride",
    product_owner_username: 1,
    project_manager_username: 2,
  },
  {
    teamid: 2,
    teamname: "Whisker Innovation Squad",
    product_owner_username: 3,
    project_manager_username: 4,
  },
];

export const loginPromptMessage = "You're viewing demo data. Please log in to access your personal workspace and real projects.";

export const dummyTasksWithUsers: Task[] = [
  {
    id: 1,
    title: "Design Purr-fect Cat Profile Cards",
    description: "Create irresistibly adorable profile cards for each cafe cat featuring their whisker-perfect photos, purr-sonality traits, favorite nap spots, preferred scritching locations, ",
    status: "in_progress" as any,
    priority: Priority.high,
    startdate: "2024-01-20",
    duedate: "2024-02-15",
    points: 13,
    projectid: 1,
    authorid: 1,
    assigneeid: 2,
    tags: "design,ui,cats,profiles",
    createdat: Date.now() - 86400000 * 5,
    updatedat: Date.now() - 3600000 * 2,
    author: {
      UserId: 1,
      Username: "whisker_wizard",
      Email: "whiskers@catcafe.com",
      ProfilePictureURL: "/cat1.png",
      TeamId: 1,
    },
    assignee: {
      UserId: 2,
      Username: "purr_designer",
      Email: "purrfect@catcafe.com", 
      ProfilePictureURL: "/cat2.webp",
      TeamId: 1,
    },
    comments: [
      {
        id: 1,
        text: "Great cat profile cards! Love the cattitude meter.",
        userId: 2,
        taskId: 1,
        createdAt: "2024-02-10"
      },
      {
        id: 2,
        text: "Add biscuit making skill indicator and zoomies chart?",
        userId: 1,
        taskId: 1,
        createdAt: "2024-02-11"
      }
    ],
    attachments: [
      {
        id: 1,
        FileURL: "/cat1.png",
        FileName: "cat_profile_mockup_v3.png",
        taskId: 1,
        uploadedId: 2
      },
      {
        id: 2,
        FileURL: "/cat2.webp", 
        FileName: "purr-sonality_card_template.webp",
        taskId: 1,
        uploadedId: 1
      },
      {
        id: 3,
        FileURL: "/cat3.webp",
        FileName: "cattitude_meter_design.webp", 
        taskId: 1,
        uploadedId: 2
      },
      {
        id: 4,
        FileURL: "/cat4.webp",
        FileName: "fluffiness_rating_scale.webp",
        taskId: 1,
        uploadedId: 1
      }
    ]
  },
  {
    id: 2,
    title: "Purr & Ambient Meow Effects",
    description: "Add soothing purr sound effects and gentle meow ambiance throughout the reservation system to `",
    status: "todo" as any,
    priority: Priority.medium,
    startdate: "2024-02-10",
    duedate: "2024-02-25",
    points: 8,
    projectid: 1,
    authorid: 2,
    assigneeid: 3,
    tags: "audio,frontend,ambiance,purr",
    createdat: Date.now() - 86400000 * 3,
    updatedat: Date.now() - 3600000 * 6,
    author: {
      UserId: 2,
      Username: "purr_designer",
      Email: "purrfect@catcafe.com", 
      ProfilePictureURL: "/cat2.webp",
      TeamId: 1,
    },
    assignee: {
      UserId: 3,
      Username: "meow_developer",
      Email: "meowster@catcafe.com",
      ProfilePictureURL: "/cat3.webp",
      TeamId: 2,
    },
    comments: [
      {
        id: 5,
        text: "Love the purr soundscape! Winter fireplace combo is relaxing.",
        userId: 2,
        taskId: 2,
        createdAt: "2024-02-12"
      },
      {
        id: 6,
        text: "Maine Coon purr level 7 is perfect! Add chorus mode?",
        userId: 1,
        taskId: 2,
        createdAt: "2024-02-13"
      }
    ],
    attachments: [
      {
        id: 7,
        FileURL: "/logo.webp",
        FileName: "purr_soundscape_waveforms.webp",
        taskId: 2,
        uploadedId: 2
      }
    ]
  },
  {
    id: 3,
    title: "AI-Powered Whisker Recognition ",
    description: "Develop a revolutionary AI system that identifies individual cats by their unique whisker patterns while simultaneously analyzing their mood through facial expressions, tail position, e",
    status: "in_progress" as any,
    priority: Priority.urgent,
    startdate: "2024-02-15",
    duedate: "2024-03-15",
    points: 21,
    projectid: 2,
    authorid: 1,
    assigneeid: 1,
    tags: "ai,machine-learning,computer-vision",
    createdat: Date.now() - 86400000 * 8,
    updatedat: Date.now() - 3600000 * 1,
    author: {
      UserId: 1,
      Username: "whisker_wizard",
      Email: "whiskers@catcafe.com",
      ProfilePictureURL: "/cat1.png",
      TeamId: 1,
    },
    assignee: {
      UserId: 1,
      Username: "whisker_wizard",
      Email: "whiskers@catcafe.com",
      ProfilePictureURL: "/cat1.png",
      TeamId: 1,
    },
    comments: [
      {
        id: 3,
        text: "Whisker recognition at 99.9% accuracy! Pre-zoomies detection works.",
        userId: 1,
        taskId: 3,
        createdAt: "2024-02-14"
      },
      {
        id: 4,
        text: "AI predicted Princess Fluffington's stare mode perfectly!",
        userId: 3,
        taskId: 3,
        createdAt: "2024-02-16"
      }
    ],
    attachments: [
      {
        id: 5,
        FileURL: "/cat5.webp",
        FileName: "whisker_pattern_analysis_v2.webp",
        taskId: 3,
        uploadedId: 1
      },
      {
        id: 6,
        FileURL: "/cat6.webp",
        FileName: "ai_mood_detection_demo.webp",
        taskId: 3,
        uploadedId: 3
      }
    ]
  }
];

export const dummySearchResults = {
  task: dummyTasksWithUsers.slice(0, 2),
  project: dummyProjects.slice(0, 2), 
  user: dummyUsers.slice(0, 2),
};