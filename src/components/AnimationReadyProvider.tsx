import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface AnimationReadyContextType {
  isReady: boolean;
  registerComponent: (id: string) => void;
  markComponentReady: (id: string) => void;
}

const AnimationReadyContext = createContext<AnimationReadyContextType>({
  isReady: false,
  registerComponent: () => {},
  markComponentReady: () => {}
});

export const useAnimationReady = () => useContext(AnimationReadyContext);

interface AnimationReadyProviderProps {
  children: React.ReactNode;
  minDelay?: number;
}

export const AnimationReadyProvider: React.FC<AnimationReadyProviderProps> = ({ 
  children, 
  minDelay = 300 
}) => {
  const [isReady, setIsReady] = useState(false);
  const registeredRef = useRef<Set<string>>(new Set());
  const readyRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDelayPassedRef = useRef(false);

  const checkAllReady = useCallback(() => {
    if (!minDelayPassedRef.current) return;
    
    const allRegistered = registeredRef.current.size;
    const allReady = readyRef.current.size;
    
    if (allRegistered > 0 && allReady >= allRegistered) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsReady(true);
        });
      });
    }
  }, []);

  const registerComponent = useCallback((id: string) => {
    registeredRef.current.add(id);
  }, []);

  const markComponentReady = useCallback((id: string) => {
    readyRef.current.add(id);
    checkAllReady();
  }, [checkAllReady]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      minDelayPassedRef.current = true;
      checkAllReady();
      
      setTimeout(() => {
        if (!isReady) {
          setIsReady(true);
        }
      }, 1200);
    }, minDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [minDelay, checkAllReady]);

  return (
    <AnimationReadyContext.Provider value={{ isReady, registerComponent, markComponentReady }}>
      {children}
    </AnimationReadyContext.Provider>
  );
};

export default AnimationReadyProvider;
