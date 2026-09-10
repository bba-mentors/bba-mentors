import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  TrendingUp,
  X,
  FileCheck,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import type { WeeklyExam, ExamAttempt } from '../../types/index.ts';

interface ExamEngineModalProps {
  exam: WeeklyExam;
  studentId: string;
  studentName: string;
  onClose: () => void;
  onAttemptCompleted: (attempt: ExamAttempt) => void;
}

export function ExamEngineModal({
  exam,
  studentId,
  studentName,
  onClose,
  onAttemptCompleted,
}: ExamEngineModalProps) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ attempt: ExamAttempt; examReview: any[] } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (result) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex.toString() });
  };

  const handleSubmit = async () => {
    if (isSubmitting || result) return;
    setIsSubmitting(true);
    try {
      const res = await api.submitExamAttempt(exam.id, {
        studentId,
        answers,
        startedAt: new Date().toISOString(),
      });
      setResult(res);
      onAttemptCompleted(res.attempt);
    } catch (err) {
      console.error(err);
      alert('Failed to submit exam attempt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = exam.questions[currentQIndex];
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-left">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                {exam.board} • {exam.classGrade}
              </span>
              <span className="text-xs text-slate-300 font-semibold">{exam.subject}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{exam.title || exam.examName}</h3>
            <p className="text-xs text-slate-400">Student: {studentName}</p>
          </div>

          {!result && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        {result ? (
          /* RESULT SCREEN */
          <div className="p-8 overflow-y-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Assessment Submitted!</h2>
              <p className="text-xs text-slate-500">
                Score calculated instantly and recorded in {studentName}'s learning history.
              </p>
            </div>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Marks Obtained</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {result.attempt.score} / {result.attempt.maxMarks}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Percentage</span>
                <span className="text-2xl font-black text-blue-900 mt-1 block">
                  {result.attempt.percentage}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Score Shift</span>
                {(() => {
                  const shift = typeof result.attempt.improvement === 'number'
                    ? result.attempt.improvement
                    : typeof result.attempt.scoreDifference === 'number'
                    ? result.attempt.scoreDifference
                    : Number(result.attempt.improvement) || 0;
                  return (
                    <span className={`text-2xl font-black mt-1 flex items-center justify-center gap-1 ${
                      shift >= 0 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {shift >= 0 ? '+' : ''}
                      {shift}%
                    </span>
                  );
                })()}
                <span className="text-[10px] text-slate-400">vs Previous Exam</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Accuracy</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {result.attempt.correctAnswers ?? result.attempt.correctCount} of {result.attempt.totalQuestions ?? (result.attempt.correctCount + result.attempt.wrongCount + result.attempt.skippedCount)}
                </span>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900">Answer Key & Explanations</h4>
              <div className="space-y-3">
                {result.examReview.map((rev, idx) => (
                  <div
                    key={rev.questionId}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      rev.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Q{idx + 1}. Topic: {rev.topic}
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        rev.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                      }`}>
                        {rev.isCorrect ? '✓ Correct (+1 Mark)' : '✗ Incorrect (0 Marks)'}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">{rev.questionText}</p>
                    <p className="text-slate-600">
                      <strong>Correct Answer:</strong> Option {String.fromCharCode(65 + rev.correctAnswerIndex)}: {rev.options[rev.correctAnswerIndex]}
                    </p>
                    {rev.explanation && (
                      <p className="text-slate-500 italic mt-1">
                        <strong>Explanation:</strong> {rev.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE EXAM TAKING */
          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto space-y-6">
            {/* Top status bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  Question {currentQIndex + 1} of {totalQuestions}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                  Topic: {currentQ.topic}
                </span>
              </div>
              <span className="font-semibold text-blue-900">
                {answeredCount} of {totalQuestions} Answered
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <p className="text-base font-semibold text-slate-900 leading-relaxed">
                {currentQ.questionText}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQ.id] === optIdx.toString();
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 text-xs sm:text-sm font-medium transition ${
                        isSelected
                          ? 'border-blue-800 bg-blue-50 text-blue-950 ring-2 ring-blue-800'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Navigation Palette */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {exam.questions.map((q, idx) => {
                  const isAns = answers[q.id] !== undefined;
                  const isCurr = idx === currentQIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                        isCurr
                          ? 'ring-2 ring-blue-900 ring-offset-1 bg-blue-900 text-white'
                          : isAns
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentQIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black shadow"
                  >
                    {isSubmitting ? 'Scoring Assessment...' : 'Submit Assessment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
