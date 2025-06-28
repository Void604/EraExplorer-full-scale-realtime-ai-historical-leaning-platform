import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  TrendingUp,
  Award,
  Calendar,
  Brain,
  Zap
} from 'lucide-react';
import { LearningStats, UserProgress } from '../types';

interface LearningDashboardProps {
  userProgress: UserProgress[];
  onStartLearning: () => void;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  userProgress,
  onStartLearning
}) => {
  const [stats, setStats] = useState<LearningStats>({
    totalTimeSpent: 0,
    eventsCompleted: 0,
    quizzesCompleted: 0,
    currentStreak: 0,
    favoriteCategory: 'empire',
    knowledgeLevel: 0
  });

  const [dailyGoal, setDailyGoal] = useState(30); // minutes
  const [todayProgress, setTodayProgress] = useState(15);

  useEffect(() => {
    // Calculate stats from user progress
    const totalTime = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    const completed = userProgress.filter(p => p.currentYear > 0).length;
    const quizzes = userProgress.reduce((sum, p) => sum + p.completedQuizzes.length, 0);
    
    setStats({
      totalTimeSpent: totalTime,
      eventsCompleted: completed,
      quizzesCompleted: quizzes,
      currentStreak: Math.max(...userProgress.map(p => p.learningStreak)),
      favoriteCategory: 'empire',
      knowledgeLevel: Math.min(100, (completed * 10) + (quizzes * 5))
    });
  }, [userProgress]);

  const achievements = [
    { id: 'first_event', title: 'Time Traveler', description: 'Complete your first historical event', icon: Clock, unlocked: stats.eventsCompleted > 0 },
    { id: 'quiz_master', title: 'Quiz Master', description: 'Complete 10 quizzes', icon: Brain, unlocked: stats.quizzesCompleted >= 10 },
    { id: 'streak_week', title: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: Zap, unlocked: stats.currentStreak >= 7 },
    { id: 'knowledge_seeker', title: 'Knowledge Seeker', description: 'Reach 50% knowledge level', icon: Star, unlocked: stats.knowledgeLevel >= 50 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
              <p className="text-gray-600">Track your historical learning journey</p>
            </div>
            <button
              onClick={onStartLearning}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.eventsCompleted}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Events Completed</h3>
            <p className="text-sm text-gray-600">Historical periods explored</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.quizzesCompleted}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Quizzes Passed</h3>
            <p className="text-sm text-gray-600">Knowledge assessments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.currentStreak}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Learning Streak</h3>
            <p className="text-sm text-gray-600">Consecutive days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.knowledgeLevel}%</span>
            </div>
            <h3 className="font-semibold text-gray-900">Knowledge Level</h3>
            <p className="text-sm text-gray-600">Overall progress</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Goal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Daily Goal</h3>
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Today's Progress</span>
                <span className="text-sm font-medium text-gray-900">{todayProgress}/{dailyGoal} min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (todayProgress / dailyGoal) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setDailyGoal(15)}
                className={`w-full p-2 rounded-lg text-sm transition-colors ${
                  dailyGoal === 15 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                15 min/day (Beginner)
              </button>
              <button
                onClick={() => setDailyGoal(30)}
                className={`w-full p-2 rounded-lg text-sm transition-colors ${
                  dailyGoal === 30 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                30 min/day (Intermediate)
              </button>
              <button
                onClick={() => setDailyGoal(60)}
                className={`w-full p-2 rounded-lg text-sm transition-colors ${
                  dailyGoal === 60 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                60 min/day (Advanced)
              </button>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center p-3 rounded-xl transition-all ${
                      achievement.unlocked 
                        ? 'bg-yellow-50 border border-yellow-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-xs ${
                        achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Learning Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Learning Calendar</h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const hasActivity = Math.random() > 0.7;
                const isToday = i === 15;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                      isToday 
                        ? 'bg-indigo-600 text-white' 
                        : hasActivity 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    {i + 1 <= 30 ? i + 1 : ''}
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-gray-100 rounded-sm" />
                <div className="w-3 h-3 bg-green-200 rounded-sm" />
                <div className="w-3 h-3 bg-green-400 rounded-sm" />
                <div className="w-3 h-3 bg-green-600 rounded-sm" />
              </div>
              <span>More</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};