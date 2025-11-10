export interface TimelineEvent {
  year: number;
  title: string;
  subtitle: string;
  description?: string;
  type: 'education' | 'work' | 'project' | 'achievement' | 'creative' | 'leadership' | 'milestone';
  current?: boolean;
  icon?: string;
}

export const timelineData: TimelineEvent[] = [
  {
    year: 2025,
    title: 'Marketing Ops Intern',
    subtitle: 'Tidyhire • Final Year CS',
    description: 'Unique hybrid of Marketing and visual design expertise',
    type: 'milestone',
    current: true,
    icon: 'star'
  },
  {
    year: 2025,
    title: 'Astrix',
    subtitle: 'Creative Associate',
    description: 'Integrated marketing campaigns combining all acquired skills',
    type: 'work',
    icon: 'briefcase'
  },
  {
    year: 2024,
    title: 'Fastrbuild',
    subtitle: 'Creative Lead',
    description: 'First leadership role managing creative strategy for brand',
    type: 'leadership',
    icon: 'crown'
  },
  {
    year: 2023,
    title: 'Freelance Breakthrough',
    subtitle: '20+ Clients • 5+ Brands',
    description: 'Established independent practice across multiple creative disciplines',
    type: 'work',
    icon: 'rocket'
  },
  {
    year: 2023,
    title: 'D3 Fest',
    subtitle: 'Media Coordinator',
    description: "Managed media for Odisha's largest techno-cultural fest",
    type: 'leadership',
    icon: 'users'
  },
  {
    year: 2023,
    title: 'Advaita Fest',
    subtitle: '3-Year Contributor',
    description: "Long-term commitment to IIIT Bhubaneswar's flagship event",
    type: 'milestone',
    icon: 'award'
  },
  {
    year: 2022,
    title: 'IIIT Bhubaneswar',
    subtitle: 'B.Tech Computer Science',
    description: 'Balancing rigorous technical education with creative pursuits',
    type: 'education',
    icon: 'code'
  },
  {
    year: 2022,
    title: 'Photography & Tech',
    subtitle: 'Member → Core Team',
    description: 'Transitioned from individual to team-based creative work',
    type: 'leadership',
    icon: 'camera'
  },
  {
    year: 2019,
    title: 'Creative Awakening',
    subtitle: 'Foundation Building',
    description: 'Began 5+ year journey in video editing & visual design',
    type: 'creative',
    icon: 'film'
  },
  {
    year: 2014,
    title: 'Academic Excellence',
    subtitle: '93% ',
    description: 'Strong foundation in 10th & 12th grade',
    type: 'education',
    icon: 'graduation'
  }
];
