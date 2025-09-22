import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, GraduationCap, TrendingUp, Clock, Award, ArrowUpRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardOverview() {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Active learners'
    },
    {
      title: 'Total Courses',
      value: '89',
      change: '+5%',
      changeType: 'positive' as const,
      icon: BookOpen,
      description: 'Available courses'
    },
    {
      title: 'Active Trainers',
      value: '45',
      change: '+3%',
      changeType: 'positive' as const,
      icon: GraduationCap,
      description: 'Expert instructors'
    },
    {
      title: 'Completion Rate',
      value: '78%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Course completion'
    },
    {
      title: 'Avg. Study Time',
      value: '4.2h',
      change: '+0.5h',
      changeType: 'positive' as const,
      icon: Clock,
      description: 'Per week'
    },
    {
      title: 'Certificates Issued',
      value: '892',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Award,
      description: 'This month'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'course',
      message: 'New course "React Advanced Patterns" published',
      time: '2 hours ago',
      user: 'John Doe'
    },
    {
      id: 2,
      type: 'student',
      message: 'Sarah Wilson completed "JavaScript Fundamentals"',
      time: '4 hours ago',
      user: 'Sarah Wilson'
    },
    {
      id: 3,
      type: 'trainer',
      message: 'New trainer Mike Johnson joined the platform',
      time: '6 hours ago',
      user: 'Mike Johnson'
    },
    {
      id: 4,
      type: 'course',
      message: 'Course "Python for Data Science" updated',
      time: '8 hours ago',
      user: 'Dr. Emily Chen'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.title} className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
            "border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
          )}>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
              index === 0 && "from-pthrives-teal to-pthrives-green",
              index === 1 && "from-blue-400 to-blue-600",
              index === 2 && "from-purple-400 to-purple-600",
              index === 3 && "from-green-400 to-green-600",
              index === 4 && "from-orange-400 to-orange-600",
              index === 5 && "from-pink-400 to-pink-600"
            )} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground mb-3">
                {stat.description}
              </p>
              <div className="flex items-center">
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates from your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-4 group/item">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === 0 && "bg-gradient-to-r from-pthrives-teal to-pthrives-green",
                    index === 1 && "bg-gradient-to-r from-blue-400 to-blue-600",
                    index === 2 && "bg-gradient-to-r from-purple-400 to-purple-600",
                    index === 3 && "bg-gradient-to-r from-green-400 to-green-600"
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none group-hover/item:text-primary transition-colors">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[
                { icon: BookOpen, text: "Create New Course", href: "/courses" },
                { icon: Users, text: "Add New Student", href: "/students" },
                { icon: GraduationCap, text: "Invite Trainer", href: "/trainers" },
                { icon: Award, text: "Issue Certificate", href: "/certificates" }
              ].map((action, index) => (
                <button 
                  key={action.text}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border-0 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 group/action relative overflow-hidden"
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover/action:opacity-5 transition-opacity duration-300",
                    index === 0 && "from-pthrives-teal to-pthrives-green",
                    index === 1 && "from-blue-400 to-blue-600",
                    index === 2 && "from-purple-400 to-purple-600",
                    index === 3 && "from-green-400 to-green-600"
                  )} />
                  <div className="p-2 rounded-lg bg-primary/10 group-hover/action:bg-primary/20 transition-colors relative z-10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium group-hover/action:text-primary transition-colors relative z-10">
                    {action.text}
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover/action:opacity-100 transition-opacity ml-auto relative z-10" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
