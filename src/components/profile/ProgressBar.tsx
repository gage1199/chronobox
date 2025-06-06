interface ProgressBarProps {
  completion: number
}

export default function ProgressBar({ completion }: ProgressBarProps) {
  const steps = [
    { name: 'Avatar', threshold: 10 },
    { name: 'Basic Info', threshold: 30 },
    { name: 'Digital Will', threshold: 50 },
    { name: 'Release Policy', threshold: 65 },
    { name: 'Trusted Contacts', threshold: 90 },
    { name: 'Security', threshold: 100 }
  ]

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200 dark:bg-amber-900 dark:text-amber-300">
              Profile Setup
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-amber-600 dark:text-amber-400">
              {completion}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200 dark:bg-slate-700">
          <div 
            style={{ width: `${completion}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out"
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = completion >= step.threshold
          const isActive = completion >= (steps[index - 1]?.threshold || 0) && completion < step.threshold
          
          return (
            <div key={step.name} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                isCompleted 
                  ? 'bg-amber-500 text-white shadow-lg' 
                  : isActive
                    ? 'bg-amber-200 text-amber-700 dark:bg-amber-900 dark:text-amber-300 ring-2 ring-amber-400'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-400'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${
                isCompleted || isActive
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {step.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Completion Message */}
      {completion >= 85 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              Great! Your profile is ready. You can now complete the setup.
            </p>
          </div>
        </div>
      )}

      {/* Requirements Notice */}
      {completion < 85 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">Almost there!</span> Complete the remaining sections to unlock all ChronoBox features.
          </p>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
            Required: Avatar, Basic Info, Digital Will, Release Policy, and at least one Trusted Contact
          </div>
        </div>
      )}
    </div>
  )
} 