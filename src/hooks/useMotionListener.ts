import { useEffect, useState } from 'react';
import type { MotionValue } from 'motion/react';

export function useMotionListener<T>(mv: MotionValue<T>): T {
  const [value, setValue] = useState<T>(mv.get());
  useEffect(() => {
    setValue(mv.get());
    return mv.on('change', (v) => setValue(v as T));
  }, [mv]);
  return value;
}
