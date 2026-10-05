'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle2, Keyboard, Target, Trophy } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('onboarding_completed', 'true');
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#415239] to-[#2a3a2a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm font-medium">Step {step} of {totalSteps}</span>
            <button onClick={handleSkip} className="text-white/70 text-sm hover:text-white transition-colors">
              Skip
            </button>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#415239]/10 rounded-full flex items-center justify-center">
                <Keyboard className="w-10 h-10 text-[#415239]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Welcome to ANDIKA
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Your journey to becoming a faster, more accurate typist starts here. 
              Let's set up your experience in just a few steps.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Track your typing speed and accuracy</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Compete with typists worldwide</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Earn achievements and build streaks</span>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full btn-andika-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#415239]/10 rounded-full flex items-center justify-center">
                <Target className="w-10 h-10 text-[#415239]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Set Your Goals
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Choose your starting point. You can always adjust these later in settings.
            </p>
            <div className="space-y-4 mb-8">
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#415239] hover:bg-[#415239]/5 transition-all text-left">
                <div className="font-semibold text-gray-900 mb-1">Beginner</div>
                <div className="text-sm text-gray-600">I'm new to touch typing (0-30 WPM)</div>
              </button>
              <button className="w-full p-4 border-2 border-[#415239] bg-[#415239]/5 rounded-xl text-left">
                <div className="font-semibold text-gray-900 mb-1">Intermediate</div>
                <div className="text-sm text-gray-600">I can type reasonably well (30-60 WPM)</div>
              </button>
              <button className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#415239] hover:bg-[#415239]/5 transition-all text-left">
                <div className="font-semibold text-gray-900 mb-1">Advanced</div>
                <div className="text-sm text-gray-600">I'm a fast typist (60+ WPM)</div>
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 btn-andika-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#415239]/10 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-[#415239]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              You're All Set!
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Here's what you can do next:
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-[#415239] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-gray-700">Take your first typing test</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-[#415239] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-gray-700">Explore different typing modes</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="w-8 h-8 bg-[#415239] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-gray-700">Check out the leaderboards</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 btn-andika-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                Start Typing
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
