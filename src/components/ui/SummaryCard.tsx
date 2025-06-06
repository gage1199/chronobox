import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import Button from './Button';
import Card from './Card';

// Reusable SummaryCard component for dashboard statistics
// Features: consistent styling, accessibility, progress bar support for storage

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtext: string;
  actionLabel: string;
  actionHref: string;
  icon: LucideIcon;
  // Special props for storage card progress bar
  showProgressBar?: boolean;
  progressValue?: number;
  progressMax?: number;
  storageUsed?: number;
  storageTotal?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtext,
  actionLabel,
  actionHref,
  icon: Icon,
  showProgressBar = false,
  progressValue = 0,
  progressMax = 100,
  storageUsed,
  storageTotal
}) => {
  // Determine icon background color based on title
  const getIconColorClass = () => {
    switch (title) {
      case 'My Library':
        return 'bg-amber-100 text-amber-600';
      case 'Life Timeline':
        return 'bg-blue-100 text-blue-600';
      case 'Storage':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColorClass()}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-2xl font-bold text-gray-900">
          {value}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {/* Progress bar for storage card */}
      {showProgressBar && storageUsed && storageTotal && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{storageUsed} GB used</span>
            <span>{storageTotal} GB total</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressValue}%` }}
              role="progressbar"
              aria-valuenow={progressValue}
              aria-valuemax={progressMax}
              aria-label={`Storage usage: ${progressValue}% of ${storageTotal}GB used`}
            />
          </div>
        </div>
      )}
      
      {/* Regular subtext for non-storage cards */}
      {!showProgressBar && (
        <p className="text-gray-600 mb-4">
          {subtext}
        </p>
      )}
      
      <Link href={actionHref}>
        <Button 
          variant={title === 'Storage' ? 'ghost' : 'ghost'} 
          size="sm" 
          className={`w-full min-h-12 ${title === 'Storage' ? 'text-amber-600 hover:text-amber-700' : ''}`}
        >
          {actionLabel}
        </Button>
      </Link>
    </Card>
  );
};

export default SummaryCard; 