/**
 * YouTube Clone Seed Dataset
 * Contains channels, categories, and video data.
 */

export const CATEGORIES = [
  "All",
  "Gaming",
  "Music",
  "Tech",
  "React",
  "News",
  "Podcasts"
];

export const CHANNELS = [
  {
    id: "c1",
    name: "Marques Brownlee",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    subscribers: "18.2M subscribers",
    verified: true,
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80",
    description: "Quality tech videos | YouTuber | Geek | Consumer Electronics enthusiast."
  },
  {
    id: "c2",
    name: "freeCodeCamp.org",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
    subscribers: "9.4M subscribers",
    verified: true,
    bannerUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=300&q=80",
    description: "Learn to code for free. Thousands of interactive coding tutorials and open source projects."
  },
  {
    id: "c3",
    name: "Lofi Girl",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    subscribers: "14.1M subscribers",
    verified: true,
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&h=300&q=80",
    description: "Peaceful lofi hip hop radio - beats to relax/study to 24/7."
  },
  {
    id: "c4",
    name: "IGN",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
    subscribers: "17.9M subscribers",
    verified: true,
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=300&q=80",
    description: "The latest game reviews, trailers, walkthroughs, and gaming news."
  },
  {
    id: "c5",
    name: "Lex Fridman",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    subscribers: "4.2M subscribers",
    verified: true,
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=300&q=80",
    description: "Conversations about science, tech, history, philosophy, and the intelligence of the future."
  },
  {
    id: "c6",
    name: "BBC News",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    subscribers: "15.6M subscribers",
    verified: true,
    bannerUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&h=300&q=80",
    description: "World news, breaking news, analysis and top stories from the BBC."
  },
  {
    id: "c7",
    name: "Web Dev Simplified",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80",
    subscribers: "1.6M subscribers",
    verified: true,
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=300&q=80",
    description: "Full stack web development tutorials making complex topics simple."
  }
];

export const VIDEOS = [
  {
    id: "v1",
    title: "Building a Modern Web App from Scratch in 2026",
    description: "A complete deep-dive guide to modern web development techniques, responsive UI, component design, and reactive state management.",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    embedId: "fJ9rUzIMcZQ",
    channelId: "c2",
    views: "1.2M views",
    timestamp: "3 days ago",
    category: "Tech",
    duration: "42:15"
  },
  {
    id: "v2",
    title: "React 19 Full Course – What's New and How to Migrate",
    description: "Explore React Actions, useActionState, useOptimistic, server components, and asset preloading in this complete crash course.",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
    embedId: "w7ejDZ8SWv8",
    channelId: "c7",
    views: "845K views",
    timestamp: "1 week ago",
    category: "React",
    duration: "1:15:30"
  },
  {
    id: "v3",
    title: "The Smartphone of the Future Teardown & Review",
    description: "We spent 30 days testing the most ambitious smartphone hardware ever designed. Here is what works, what breaks, and why.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    embedId: "kJQP7kiw5Fk",
    channelId: "c1",
    views: "3.8M views",
    timestamp: "2 weeks ago",
    category: "Tech",
    duration: "18:42"
  },
  {
    id: "v4",
    title: "lofi hip hop radio 📚 - beats to relax/study to",
    description: "The iconic 24/7 lofi chill music stream for working, studying, coding, or falling asleep. Smooth jazz samples and gentle vinyl beats.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    embedId: "jfKfPfyJRdk",
    channelId: "c3",
    views: "72M views",
    timestamp: "Streamed live",
    category: "Music",
    duration: "Live"
  },
  {
    id: "v5",
    title: "Top 10 Most Anticipated Open World Games of the Year",
    description: "From expansive RPG universes to hyper-detailed survival simulations, countdown the biggest upcoming titles redefining immersive gameplay.",
    thumbnailUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    embedId: "3JZ_D3ELwOQ",
    channelId: "c4",
    views: "1.9M views",
    timestamp: "5 days ago",
    category: "Gaming",
    duration: "24:18"
  },
  {
    id: "v6",
    title: "Artificial Superintelligence and the Autonomous Future",
    description: "An in-depth conversation exploring neural network frontiers, emergent reasoning, robotics control architectures, and human alignment.",
    thumbnailUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    embedId: "L_LUpnjgPso",
    channelId: "c5",
    views: "2.4M views",
    timestamp: "1 month ago",
    category: "Podcasts",
    duration: "3:12:45"
  },
  {
    id: "v7",
    title: "Global Tech Summit: Breakthroughs in Renewable Energy",
    description: "Special international coverage on next-generation solid-state battery breakthroughs and fusion ignition records achieved this quarter.",
    thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=WPni755-Krg",
    embedId: "WPni755-Krg",
    channelId: "c6",
    views: "620K views",
    timestamp: "4 days ago",
    category: "News",
    duration: "14:50"
  },
  {
    id: "v8",
    title: "React State Management in 2026: Zustand vs Signals vs Redux",
    description: "Compare performance benchmarks, bundle sizes, boilerplate, and developer ergonomics across the leading React state libraries.",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=7wtfhZwyrcc",
    embedId: "7wtfhZwyrcc",
    channelId: "c7",
    views: "410K views",
    timestamp: "2 weeks ago",
    category: "React",
    duration: "28:10"
  },
  {
    id: "v9",
    title: "Elden Ring: Shadow of the Erdtree – Ultimate Boss Guide",
    description: "Every strategy, dodge timing, stagger threshold, and optimal talisman setup to conquer the toughest challenges in the Realm of Shadow.",
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    embedId: "W6NZfCO5SIk",
    channelId: "c4",
    views: "2.1M views",
    timestamp: "3 weeks ago",
    category: "Gaming",
    duration: "35:40"
  },
  {
    id: "v10",
    title: "Synthwave Radio – Chill Synth Beats to Code and Cruise",
    description: "Retro-futuristic synthwave, cyberpunk neon soundscapes, and mellow synth arpeggios crafted for deep focus and midnight drives.",
    thumbnailUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
    embedId: "4xDzrJKXOOY",
    channelId: "c3",
    views: "11.5M views",
    timestamp: "Streamed live",
    category: "Music",
    duration: "Live"
  },
  {
    id: "v11",
    title: "The M4 MacBook Pro One Month Later: Reality Check",
    description: "Beyond the synthetic benchmark graphs: battery life, thermal throttling under continuous 3D rendering, and unified memory bandwidth tests.",
    thumbnailUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    embedId: "Ke90Tje7VS0",
    channelId: "c1",
    views: "1.7M views",
    timestamp: "6 days ago",
    category: "Tech",
    duration: "16:25"
  },
  {
    id: "v12",
    title: "Quantum Computing Explained Without the Hype",
    description: "A Nobel laureate and quantum physicist breaks down qubits, superposition, decoherence errors, and realistic timelines for quantum supremacy.",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
    embedId: "kXYiU_JCYtU",
    channelId: "c5",
    views: "3.2M views",
    timestamp: "2 months ago",
    category: "Podcasts",
    duration: "2:48:19"
  },
  {
    id: "v13",
    title: "SpaceX Starship Orbital Insertion & Booster Catch Analysis",
    description: "Direct telemetry breakdown and aero-braking physics of the mechanical chopsticks precision capture tower catch.",
    thumbnailUrl: "https://images.unsplash.com/photo-1517976487502-5731f8d48419?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=M576WGiDBdQ",
    embedId: "M576WGiDBdQ",
    channelId: "c6",
    views: "4.5M views",
    timestamp: "1 day ago",
    category: "News",
    duration: "19:04"
  },
  {
    id: "v14",
    title: "Never Gonna Give You Up (Remastered 4K)",
    description: "The legendary classic music video in crisp high-definition remaster. Rick Astley's timeless hit that shaped internet culture.",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&h=450&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedId: "dQw4w9WgXcQ",
    channelId: "c3",
    views: "1.5B views",
    timestamp: "14 years ago",
    category: "Music",
    duration: "3:32"
  }
];

// Dual-compatibility: attach exports to global YT namespace
if (typeof window !== 'undefined') {
  window.YT = window.YT || {};
  window.YT.CATEGORIES = CATEGORIES;
  window.YT.CHANNELS = CHANNELS;
  window.YT.VIDEOS = VIDEOS;
}

