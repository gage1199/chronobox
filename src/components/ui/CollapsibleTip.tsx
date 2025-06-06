import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';
import Card from './Card';

// Collapsible tip component for getting started section
// Features: completion state tracking, accessibility, smooth expand/collapse

interface CollapsibleTipProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  isCompleted?: boolean;
  borderColor?: string;
}

const CollapsibleTip: React.FC<CollapsibleTipProps> = ({
  title,
  description,
  actionLabel,
  actionHref,
  isCompleted = false,
  borderColor = 'border-amber-500'
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCompleted);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={`border-l-4 ${borderColor} ${isCompleted ? 'bg-green-50' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isCompleted && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <h3 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
              {title}
            </h3>
          </div>
          
          <button
            onClick={toggleExpanded}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} tip`}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Collapsible content */}
        {isExpanded && (
          <div className="mt-3 pl-9">
            <p className={`text-sm mb-3 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
              {description}
            </p>
            
            {!isCompleted && (
              <Link href={actionHref}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="min-h-12 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {actionLabel}
                </Button>
              </Link>
            )}
            
            {isCompleted && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Completed
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CollapsibleTip; 