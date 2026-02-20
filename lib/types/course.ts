export interface BaseCourse {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    verified: boolean;
  };
  thumbnail: string;
  duration: string;
  level: string;
  tags: string[];
}

export interface PublicCourseInterface extends BaseCourse {
  rating: number;
  ratingCount: number;
  price: number;
  discountPrice: number;
  studentsEnrolled: number;
  isBestSeller: boolean;
}

export interface DashboardCourseInterface extends BaseCourse {
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string | null;
}
