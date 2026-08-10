import {
  RocketLaunchIcon,
  FireIcon,
  LightBulbIcon,
  GlobeAltIcon,
  BeakerIcon,
  TrophyIcon
} from '@heroicons/vue/24/solid';
import type { Course } from '@/stores/courseStore';
import type { UserStats } from '@/stores/authStore';

export interface Badge {
  id: number;
  label: string;
  desc: string;
  icon: unknown;
  bg: string;
  color: string;
  unlocked: boolean;
}

interface BadgeLabels {
  firstStep: string; firstStepDesc: string;
  marathon: string; marathonDesc: string;
  quizMaster: string; quizMasterDesc: string;
  polyglot: string; polyglotDesc: string;
  scientist: string; scientistDesc: string;
  legend: string; legendDesc: string;
}

export function computeBadges(courses: Course[], stats: UserStats, level: number, labels: BadgeLabels): Badge[] {
  const completedQuizChapters = courses.reduce((total, c) => {
    return total + c.chapters.filter(ch => ch.type === 'quiz' && ch.completed).length;
  }, 0);

  const hasCompletedCategory = (categories: string[]) =>
    courses.some(c => c.progress === 100 && categories.some(cat => c.category?.toLowerCase().includes(cat) || c.categoryEn?.toLowerCase().includes(cat)));

  return [
    { id: 1, label: labels.firstStep, desc: labels.firstStepDesc, icon: RocketLaunchIcon, bg: '#DCFCE7', color: '#16a34a', unlocked: stats.coursesFollowed >= 1 },
    { id: 2, label: labels.marathon, desc: labels.marathonDesc, icon: FireIcon, bg: '#FFEDD5', color: '#ea580c', unlocked: stats.streakDays >= 7 },
    { id: 3, label: labels.quizMaster, desc: labels.quizMasterDesc, icon: LightBulbIcon, bg: '#E0E7FF', color: '#7c3aed', unlocked: completedQuizChapters >= 3 },
    { id: 4, label: labels.polyglot, desc: labels.polyglotDesc, icon: GlobeAltIcon, bg: '#E0F2FE', color: '#0284c7', unlocked: hasCompletedCategory(['langue', 'language']) },
    { id: 5, label: labels.scientist, desc: labels.scientistDesc, icon: BeakerIcon, bg: '#F3F4F6', color: '#9ca3af', unlocked: hasCompletedCategory(['science']) },
    { id: 6, label: labels.legend, desc: labels.legendDesc, icon: TrophyIcon, bg: '#F3F4F6', color: '#9ca3af', unlocked: level >= 5 }
  ];
}
