/**
 * SmoothUI Form Components
 *
 * Animated, accessible form components with spring physics and reduced motion support.
 */

// Core form components
export { default as AnimatedFileUpload } from './animated-file-upload';
export { default as AnimatedInput } from './animated-input';
export { AnimatedInputOTP, AnimatedInputOTPGroup, AnimatedInputOTPSeparator, AnimatedInputOTPSlot, AnimatedOTPInput } from './animated-o-t-p-input';
export { default as Checkbox } from './checkbox';
export { default as Combobox } from './combobox';
export { default as Pagination } from './pagination';
export { RadioGroup, RadioGroupItem } from './radio-group';

// Animation constants for custom implementations
export {
  DURATION_FAST,
  DURATION_INSTANT,
  DURATION_NORMAL,
  DURATION_SLOW,
  EASE_IN_OUT_CUBIC,
  EASE_OUT_QUINT,
  SPRING_BOUNCY,
  SPRING_DEFAULT,
  SPRING_SNAPPY,
} from './lib/animation';
