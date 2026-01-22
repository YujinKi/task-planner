import React, { useState } from 'react';
import { Clock, Target, Zap } from 'lucide-react';

export default function TaskBreakdown() {
  const [goal, setGoal] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!goal.trim()) {
      alert('목표를 입력해주세요!');
      return;
    }

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    if (totalMinutes < 30) {
      alert('최소 30분 이상의 시간을 입력해주세요!');
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal,
          totalMinutes,
          hours: hours || 0,
          minutes: minutes || 0
        })
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error('Error:', error);
      alert('계획 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            실행 가능한 계획 생성기
          </h1>
          <p className="text-gray-600">추상적인 목표를 구체적인 행동으로 바꿔드립니다</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
              <Target className="mr-2" size={20} />
              무엇을 하고 싶으신가요?
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="예: 이력서 쓰기, 프레젠테이션 준비, 영어 공부"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fuchsia-400 focus:outline-none text-lg"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
              <Clock className="mr-2" size={20} />
              사용 가능한 시간
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <select
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fuchsia-400 focus:outline-none text-lg"
                >
                  <option value="">0시간</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}시간</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-fuchsia-400 focus:outline-none text-lg"
                >
                  <option value="">0분</option>
                  <option value="30">30분</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center text-lg"
          >
            {loading ? (
              '계획 생성 중...'
            ) : (
              <>
                <Zap className="mr-2" size={20} />
                실행 가능한 계획 만들기
              </>
            )}
          </button>
        </div>

        {plan && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              당신의 실행 계획 ({plan.totalTime}분)
            </h2>

            <div className="space-y-4">
              {plan.tasks.map((task, index) => (
                <div key={index} className="border-l-4 border-fuchsia-400 pl-4 py-3 bg-pink-50 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">
                      {index + 1}. {task.step}
                    </h3>
                    <span className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {task.duration}분
                    </span>
                  </div>
                  <p className="text-gray-700">{task.description}</p>
                </div>
              ))}
            </div>

            {plan.nextSteps && (
              <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                <h3 className="font-bold text-gray-800 mb-2">다음 단계</h3>
                <p className="text-gray-700">{plan.nextSteps}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
