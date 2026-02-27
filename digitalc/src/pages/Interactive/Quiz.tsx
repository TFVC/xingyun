import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "“碳中和”是指什么？",
    options: [
      "完全不排放二氧化碳",
      "通过植树造林等方式抵消自身产生的二氧化碳排放，实现正负抵消",
      "只在白天排放二氧化碳",
      "停止所有工业生产"
    ],
    correctAnswer: 1,
    explanation: "碳中和并不意味着零排放，而是通过各种手段抵消掉产生的排放量，达到相对的“零排放”。"
  },
  {
    id: 2,
    text: "以下哪项是“绿色算力”的主要目标？",
    options: [
      "增加计算机的重量",
      "提高计算速度，不管能耗",
      "降低数据中心的PUE（电源使用效率），让计算更节能",
      "使用绿色的电脑外壳"
    ],
    correctAnswer: 2,
    explanation: "绿色算力旨在通过液冷、AI优化等技术降低能耗，PUE越接近1越好。"
  },
  {
    id: 3,
    text: "“虚拟电厂”是什么？",
    options: [
      "网络游戏里的电厂",
      "看不见的核电站",
      "一套能源管理系统，聚合分散的电力负荷参与电网调度",
      "完全不需要燃料的电厂"
    ],
    correctAnswer: 2,
    explanation: "虚拟电厂不是实体电厂，而是一套智能系统，能把充电桩、储能等聚沙成塔，像电厂一样调节电网。"
  },
  {
    id: 4,
    text: "数字化如何帮助物流行业减碳？",
    options: [
      "让卡车开得更快",
      "通过大数据优化路径，减少空驶，使用电子面单",
      "减少快递员数量",
      "禁止长途运输"
    ],
    correctAnswer: 1,
    explanation: "路径优化能显著减少不必要的燃油消耗，电子面单则减少了纸张浪费。"
  },
  {
    id: 5,
    text: "个人生活中的哪种行为属于“数字低碳”？",
    options: [
      "每天打印所有邮件",
      "使用云端文档协作，减少纸质办公",
      "购买大量电子产品",
      "24小时开着电脑"
    ],
    correctAnswer: 1,
    explanation: "无纸化办公和云协作是典型的数字低碳生活方式。"
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  const getBadge = () => {
    if (score === 5) return "数字碳中和·先锋卫士";
    if (score >= 3) return "数字碳中和·行动者";
    return "数字碳中和·探索者";
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Question {currentQuestion + 1} / {questions.length}
                </span>
                <span className="text-sm font-bold text-primary">
                  Score: {score}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
                {questions[currentQuestion].text}
              </h2>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => {
                  let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ";
                  
                  if (isAnswered) {
                    if (index === questions[currentQuestion].correctAnswer) {
                      optionClass += "border-green-500 bg-green-50 text-green-700";
                    } else if (index === selectedOption) {
                      optionClass += "border-red-500 bg-red-50 text-red-700";
                    } else {
                      optionClass += "border-gray-100 text-gray-400 opacity-50";
                    }
                  } else {
                    optionClass += "border-gray-100 hover:border-primary hover:bg-primary/5 text-gray-600";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      className={optionClass}
                      disabled={isAnswered}
                    >
                      <span>{option}</span>
                      {isAnswered && index === questions[currentQuestion].correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {isAnswered && index === selectedOption && index !== questions[currentQuestion].correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-gray-100"
                >
                  <p className="text-gray-600 mb-4 text-sm">
                    <span className="font-bold text-gray-800">解析：</span>
                    {questions[currentQuestion].explanation}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    {currentQuestion < questions.length - 1 ? "下一题" : "查看结果"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100"
            >
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">挑战完成！</h2>
              <p className="text-gray-500 mb-8">你答对了 {score} / {questions.length} 道题目</p>
              
              <div className="bg-gray-50 p-6 rounded-xl mb-8">
                <span className="text-sm text-gray-400 uppercase tracking-wider block mb-2">获得徽章</span>
                <span className="text-xl font-bold text-primary block">
                  {getBadge()}
                </span>
              </div>

              <button
                onClick={restartQuiz}
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重新挑战
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
