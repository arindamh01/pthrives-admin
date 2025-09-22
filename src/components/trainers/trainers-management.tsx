"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Eye, Mail, Star, Award, BookOpen } from 'lucide-react'

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
  avatar?: string
}

const mockTrainers: Trainer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    specialty: 'React Development',
    experience: '5 years',
    rating: 4.8,
    coursesCount: 8,
    studentsCount: 450,
    status: 'active',
    joinDate: '2023-06-15',
    bio: 'Senior React developer with expertise in modern web technologies'
  },
  {
    id: '2',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@example.com',
    specialty: 'Data Science & AI',
    experience: '8 years',
    rating: 4.9,
    coursesCount: 12,
    studentsCount: 680,
    status: 'active',
    joinDate: '2023-04-20',
    bio: 'Data scientist with PhD in Machine Learning and extensive industry experience'
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    specialty: 'UI/UX Design',
    experience: '6 years',
    rating: 4.7,
    coursesCount: 6,
    studentsCount: 320,
    status: 'active',
    joinDate: '2023-08-10',
    bio: 'Creative designer specializing in user experience and interface design'
  },
  {
    id: '4',
    name: 'Dr. Michael Rodriguez',
    email: 'michael.rodriguez@example.com',
    specialty: 'Machine Learning',
    experience: '10 years',
    rating: 4.9,
    coursesCount: 4,
    studentsCount: 180,
    status: 'active',
    joinDate: '2023-09-01',
    bio: 'ML researcher and practitioner with focus on deep learning applications'
  },
  {
    id: '5',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    specialty: 'DevOps & Cloud',
    experience: '7 years',
    rating: 4.6,
    coursesCount: 9,
    studentsCount: 290,
    status: 'pending',
    joinDate: '2024-01-15',
    bio: 'DevOps engineer with expertise in AWS, Docker, and Kubernetes'
  }
]

export function TrainersManagement() {
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteTrainer = (id: string) => {
    setTrainers(trainers.filter(trainer => trainer.id !== id))
  }

  const handleEditTrainer = (trainer: Trainer) => {
    setEditingTrainer(trainer)
    setShowCreateForm(true)
  }

  const totalTrainers = trainers.length
  const activeTrainers = trainers.filter(t => t.status === 'active').length
  const totalCourses = trainers.reduce((sum, trainer) => sum + trainer.coursesCount, 0)
  const totalStudents = trainers.reduce((sum, trainer) => sum + trainer.studentsCount, 0)
  const averageRating = (trainers.reduce((sum, trainer) => sum + trainer.rating, 0) / trainers.length).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrainers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrainers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>
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
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Trainer
        </Button>
      </div>

      {/* Trainers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrainers.map((trainer) => (
          <Card key={trainer.id} className="relative">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {trainer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{trainer.name}</CardTitle>
                  <CardDescription>{trainer.specialty}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{trainer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{trainer.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{trainer.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{trainer.coursesCount} courses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>{trainer.studentsCount} students</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                    {trainer.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditTrainer(trainer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTrainer(trainer.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trainers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trainers</CardTitle>
          <CardDescription>
            Detailed view of all trainers and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {trainer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{trainer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{trainer.email}</TableCell>
                  <TableCell>{trainer.specialty}</TableCell>
                  <TableCell>{trainer.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{trainer.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{trainer.coursesCount}</TableCell>
                  <TableCell>{trainer.studentsCount}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                      {trainer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTrainer(trainer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTrainer(trainer.id)}>
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

      {/* Create/Edit Trainer Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}</CardTitle>
            <CardDescription>
              {editingTrainer ? 'Update trainer information' : 'Add a new trainer to your platform'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter trainer name"
                  defaultValue={editingTrainer?.name || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  defaultValue={editingTrainer?.email || ''}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  placeholder="Enter specialty area"
                  defaultValue={editingTrainer?.specialty || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  placeholder="e.g., 5 years"
                  defaultValue={editingTrainer?.experience || ''}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                placeholder="Enter trainer bio"
                defaultValue={editingTrainer?.bio || ''}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateForm(false)}>
                {editingTrainer ? 'Update Trainer' : 'Add Trainer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
