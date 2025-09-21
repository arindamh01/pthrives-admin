import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

interface Course {
  id: string
  title: string
  description: string
  category: string
  trainer: string
  duration: string
  price: number
  students: number
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
}

interface CourseState {
  courses: Course[]
  addCourse: (course: Omit<Course, 'id'>) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  deleteCourse: (id: string) => void
  setCourses: (courses: Course[]) => void
}

interface Category {
  id: string
  name: string
  description: string
  color: string
  courseCount: number
  studentCount: number
  createdAt: string
}

interface CategoryState {
  categories: Category[]
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  setCategories: (categories: Category[]) => void
}

interface Trainer {
  id: string
  name: string
  email: string
  specialty: string
  experience: string
  rating: number
  coursesCount: number
  studentsCount: number
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  bio: string
}

interface TrainerState {
  trainers: Trainer[]
  addTrainer: (trainer: Omit<Trainer, 'id'>) => void
  updateTrainer: (id: string, trainer: Partial<Trainer>) => void
  deleteTrainer: (id: string) => void
  setTrainers: (trainers: Trainer[]) => void
}

interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: number
  completedCourses: number
  inProgressCourses: number
  totalStudyTime: string
  joinDate: string
  lastActive: string
  status: 'active' | 'inactive' | 'suspended'
  level: 'beginner' | 'intermediate' | 'advanced'
}

interface StudentState {
  students: Student[]
  addStudent: (student: Omit<Student, 'id'>) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  setStudents: (students: Student[]) => void
}

// Sidebar Store
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
)

// Theme Store
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
)

// Course Store
export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courses: [],
      addCourse: (course) => set((state) => ({
        courses: [...state.courses, { ...course, id: Date.now().toString() }]
      })),
      updateCourse: (id, course) => set((state) => ({
        courses: state.courses.map((c) => c.id === id ? { ...c, ...course } : c)
      })),
      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter((c) => c.id !== id)
      })),
      setCourses: (courses) => set({ courses }),
    }),
    {
      name: 'courses-storage',
    }
  )
)

// Category Store
export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, { ...category, id: Date.now().toString() }]
      })),
      updateCategory: (id, category) => set((state) => ({
        categories: state.categories.map((c) => c.id === id ? { ...c, ...category } : c)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id)
      })),
      setCategories: (categories) => set({ categories }),
    }),
    {
      name: 'categories-storage',
    }
  )
)

// Trainer Store
export const useTrainerStore = create<TrainerState>()(
  persist(
    (set) => ({
      trainers: [],
      addTrainer: (trainer) => set((state) => ({
        trainers: [...state.trainers, { ...trainer, id: Date.now().toString() }]
      })),
      updateTrainer: (id, trainer) => set((state) => ({
        trainers: state.trainers.map((t) => t.id === id ? { ...t, ...trainer } : t)
      })),
      deleteTrainer: (id) => set((state) => ({
        trainers: state.trainers.filter((t) => t.id !== id)
      })),
      setTrainers: (trainers) => set({ trainers }),
    }),
    {
      name: 'trainers-storage',
    }
  )
)

// Student Store
export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      students: [],
      addStudent: (student) => set((state) => ({
        students: [...state.students, { ...student, id: Date.now().toString() }]
      })),
      updateStudent: (id, student) => set((state) => ({
        students: state.students.map((s) => s.id === id ? { ...s, ...student } : s)
      })),
      deleteStudent: (id) => set((state) => ({
        students: state.students.filter((s) => s.id !== id)
      })),
      setStudents: (students) => set({ students }),
    }),
    {
      name: 'students-storage',
    }
  )
)
