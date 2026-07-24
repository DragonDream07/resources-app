import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values and merges conflicting Tailwind CSS classes.
 *
 * Uses `clsx` for conditional class composition and `tailwind-merge` to
 * resolve Tailwind utility conflicts (e.g. `p-2` and `p-4` will resolve to `p-4`).
 *
 * @param {...import('clsx').ClassValue} inputs - Any number of class values,
 *   objects, arrays, or falsy values accepted by clsx.
 * @returns {string} The merged className string.
 *
 * @example
 * cn('px-2 py-1', 'px-4')              // => 'py-1 px-4'
 * cn('text-red-500', isError && 'text-blue-500') // conditional
 * cn({ 'font-bold': isBold, 'opacity-50': isDisabled })
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export default cn;
