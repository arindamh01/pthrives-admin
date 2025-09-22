"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Eye, Mail, Clock, Calendar } from 'lucide-react'

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
  avatar?: string
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    enrolledCourses: 5,
    completedCourses: 3,
    inProgressCourses: 2,
    totalStudyTime: '45h 30m',
    joinDate: '2023-08-15',
    lastActive: '2024-01-20',
    status: 'active',
    level: 'intermediate'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    enrolledCourses: 3,
    completedCourses: 1,
    inProgressCourses: 2,
    totalStudyTime: '23h 15m',
    joinDate: '2023-09-20',
    lastActive: '2024-01-18',
    status: 'active',
    level: 'beginner'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    enrolledCourses: 8,
    completedCourses: 6,
    inProgressCourses: 2,
    totalStudyTime: '78h 45m',
    joinDate: '2023-07-10',
    lastActive: '2024-01-19',
    status: 'active',
    level: 'advanced'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    enrolledCourses: 2,
    completedCourses: 2,
    inProgressCourses: 0,
    totalStudyTime: '18h 20m',
    joinDate: '2023-10-05',
    lastActive: '2024-01-10',
    status: 'inactive',
    level: 'beginner'
  },
  {
    id: '5',
    name: 'Eva Brown',
    email: 'eva.brown@example.com',
    enrolledCourses: 6,
    completedCourses: 4,
    inProgressCourses: 2,
    totalStudyTime: '52h 10m',
    joinDate: '2023-06-25',
    lastActive: '2024-01-21',
    status: 'active',
    level: 'intermediate'
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank.miller@example.com',
    enrolledCourses: 4,
    completedCourses: 3,
    inProgressCourses: 1,
    totalStudyTime: '31h 45m',
    joinDate: '2023-11-12',
    lastActive: '2024-01-15',
    status: 'active',
    level: 'intermediate'
  }
]

export function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800'
      case 'intermediate':
        return 'bg-purple-100 text-purple-800'
      case 'advanced':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id))
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setShowCreateForm(true)
  }

  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'active').length
  const totalEnrolledCourses = students.reduce((sum, student) => sum + student.enrolledCourses, 0)
  const totalCompletedCourses = students.reduce((sum, student) => sum + student.completedCourses, 0)
  const averageProgress = (totalCompletedCourses / totalEnrolledCourses * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrolledCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Students Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="relative">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Mail className="h-3 w-3" />
                    <span className="text-xs">{student.email}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{student.enrolledCourses}</div>
                    <div className="text-muted-foreground text-xs">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{student.completedCourses}</div>
                    <div className="text-muted-foreground text-xs">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{student.inProgressCourses}</div>
                    <div className="text-muted-foreground text-xs">In Progress</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{student.totalStudyTime} total</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {student.joinDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(student.level)}`}>
                    {student.level}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            Detailed view of all students and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>In Progress</TableHead>
                <TableHead>Study Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(student.level)}`}>
                      {student.level}
                    </span>
                  </TableCell>
                  <TableCell>{student.enrolledCourses}</TableCell>
                  <TableCell>{student.completedCourses}</TableCell>
                  <TableCell>{student.inProgressCourses}</TableCell>
                  <TableCell>{student.totalStudyTime}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell>{student.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Student Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</CardTitle>
            <CardDescription>
              {editingStudent ? 'Update student information' : 'Add a new student to your platform'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter student name"
                  defaultValue={editingStudent?.name || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  defaultValue={editingStudent?.email || ''}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  placeholder="beginner, intermediate, or advanced"
                  defaultValue={editingStudent?.level || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  placeholder="active, inactive, or suspended"
                  defaultValue={editingStudent?.status || ''}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateForm(false)}>
                {editingStudent ? 'Update Student' : 'Add Student'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
