import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

// ============================================
// BUTTON
// ============================================

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-vibe-primary text-vibe-dark hover:bg-vibe-primary/90 focus:ring-vibe-primary shadow-vibe hover:shadow-vibe-lg',
      secondary: 'bg-vibe-secondary text-white hover:bg-vibe-secondary/90 focus:ring-vibe-secondary',
      ghost: 'bg-transparent text-vibe-gray-600 hover:bg-vibe-gray-100 focus:ring-vibe-gray-300',
      outline: 'border-2 border-vibe-primary text-vibe-primary hover:bg-vibe-primary/10 focus:ring-vibe-primary',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Berechne...
          </span>
        ) : children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

// ============================================
// CARD
// ============================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white',
      elevated: 'bg-white shadow-card hover:shadow-card-hover',
      bordered: 'bg-white border border-vibe-gray-200',
      gradient: 'bg-gradient-to-br from-vibe-light to-white',
    };
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// ============================================
// SLIDER
// ============================================

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  formatValue = (v) => v.toString(),
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-vibe-gray-600">{label}</label>
          <span className="text-lg font-semibold text-vibe-secondary font-mono">
            {formatValue(value)}
          </span>
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-vibe-gray-200 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-vibe-primary
                     [&::-webkit-slider-thumb]:shadow-vibe
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-vibe-primary
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00D4AA ${percentage}%, #E8E8EC ${percentage}%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-vibe-gray-400">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

// ============================================
// PROGRESS INDICATOR
// ============================================

interface ProgressIndicatorProps {
  steps: { id: string; label: string }[];
  currentStep: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted || isActive ? '#00D4AA' : '#E8E8EC',
                }}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  isCompleted || isActive ? 'text-vibe-dark' : 'text-vibe-gray-400'
                )}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>
              <span className={cn(
                'mt-2 text-xs font-medium hidden sm:block',
                isActive ? 'text-vibe-primary' : 'text-vibe-gray-400'
              )}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isCompleted ? 1 : 0,
                    originX: 0,
                  }}
                  className="h-full bg-vibe-primary"
                  style={{ backgroundColor: isCompleted ? '#00D4AA' : '#E8E8EC' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================
// SELECTION CARD
// ============================================

// ============================================
// SELECT DROPDOWN
// ============================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-vibe-gray-600 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-vibe-gray-200 rounded-xl
                   text-vibe-gray-700 font-medium
                   focus:outline-none focus:ring-2 focus:ring-vibe-primary focus:border-transparent
                   cursor-pointer transition-all duration-200
                   hover:border-vibe-gray-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ============================================
// TOGGLE
// ============================================

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  className,
}) => {
  return (
    <label className={cn('flex items-center justify-between cursor-pointer', className)}>
      <div>
        {label && (
          <span className="text-sm font-medium text-vibe-gray-700">{label}</span>
        )}
        {description && (
          <p className="text-xs text-vibe-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-vibe-primary' : 'bg-vibe-gray-300'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </label>
  );
};

// ============================================
// SECTION (for dashboard grouping)
// ============================================

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, children, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold text-vibe-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// ============================================
// SELECTION CARD
// ============================================

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onClick,
  className,
  children,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-2xl border-2 text-left transition-all duration-200',
        isSelected
          ? 'border-vibe-primary bg-vibe-light shadow-vibe'
          : 'border-vibe-gray-200 bg-white hover:border-vibe-gray-300',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className={cn(
            'p-3 rounded-xl',
            isSelected ? 'bg-vibe-primary/20' : 'bg-vibe-gray-100'
          )}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className={cn(
            'font-semibold',
            isSelected ? 'text-vibe-secondary' : 'text-vibe-gray-700'
          )}>
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-vibe-gray-500">{description}</p>
          )}
          {children}
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-vibe-primary flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};
