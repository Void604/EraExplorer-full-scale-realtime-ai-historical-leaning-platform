import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Brain,
  ArrowRight,
  RotateCcw,
  Star,
  X
} from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: boolean[]) => void;
  onClose: () => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  questions,
  onComplete,
  onClose
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showExplanation && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(-1); // Time's up
    }
  }, [timeLeft, showExplanation, quizCompleted]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
      onComplete(score, answers);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowExplanation(false);
    setTimeLeft(30);
    setQuizCompleted(false);
    setScore(0);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { message: "Excellent! You're a history master!", icon: Trophy, color: "text-yellow-600" };
    if (percentage >= 70) return { message: "Great job! You know your history well!", icon: Star, color: "text-green-600" };
    if (percentage >= 50) return { message: "Good effort! Keep learning!", icon: Brain, color: "text-blue-600" };
    return { message: "Keep studying! History is fascinating!", icon: Brain, color: "text-gray-600" };
  };

  if (quizCompleted) {
    const scoreMessage = getScoreMessage();
    const IconComponent = scoreMessage.icon;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6 ${
            score / questions.length >= 0.7 ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${scoreMessage.color}`} />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className={`text-base sm:text-lg mb-4 sm:mb-6 ${scoreMessage.color}`}>{scoreMessage.message}</p>
          
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              {Math.round((score / questions.length) * 100)}% Correct
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={restartQuiz}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-4 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Knowledge Quiz</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className={timeLeft <= 10 ? 'text-red-600 font-bold' : ''}>{timeLeft}s</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 sm:mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
          />
        </div>

        {/* Question */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6 sm:mb-8">
          {question.options.map((option, index) => {
            let buttonClass = "w-full p-3 sm:p-4 text-left rounded-xl border-2 transition-all duration-200 ";
            
            if (showExplanation) {
              if (index === question.correctAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (index === selectedAnswer && index !== question.correctAnswer) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
              }
            } else {
              buttonClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-900";
            }

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">{option}</span>
                  {showExplanation && (
                    <div>
                      {index === question.correctAnswer && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      )}
                      {index === selectedAnswer && index !== question.correctAnswer && (
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 sm:mb-6"
            >
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Explanation:</h4>
              <p className="text-blue-800 text-sm sm:text-base">{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        {showExplanation && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={nextQuestion}
            className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Complete Quiz
                <Trophy className="w-4 h-4 ml-2" />
              </>
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
