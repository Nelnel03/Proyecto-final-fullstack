/**
 * @file index.js
 * @description Barrel de exportaciones para todos los componentes UI de loading.
 * Permite importar desde un solo punto: import { Spinner, Skeleton, LoadingButton } from '../ui'
 */
export { default as Spinner       } from './Spinner';
export { default as SpinnerCenter } from './SpinnerCenter';
export { default as LoadingButton } from './LoadingButton';
export { default as GlobalOverlay } from './GlobalOverlay';
export { default as TopProgressBar} from './TopProgressBar';

export {
  SkeletonBlock,
  SkeletonText,
  SkeletonCard,
  SkeletonCardGrid,
  SkeletonTableRow,
  SkeletonTable,
  SkeletonProfile,
} from './Skeleton';
