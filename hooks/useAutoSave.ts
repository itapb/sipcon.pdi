import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

type SaveStatus = 'idle' | 'saving' | 'saved';

type Props = {
  id: number;
  featureId: number;
  inspectionId: number;
  readOnly: boolean;
  onSave: (payload: any) => Promise<void>;
};

export const useAutoSave = (props: Props) => {
  const [value, setvalue] = useState<number | null>(null);
  const [observation, setObservation] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const isMounted = useRef(true);
  const isFirstRender = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Validación: Obligatorio si marca NO (0) y está vacío
  const isValidationInvalid =
    value === 0 && (!observation || observation.trim() === '');

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Manejo de animaciones fluidas
  useEffect(() => {
    if (saveStatus === 'saving') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else if (saveStatus === 'saved') {
      fadeAnim.setValue(1);
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isMounted.current) setSaveStatus('idle');
      });
    }
  }, [saveStatus, fadeAnim]);

  const saveToServer = async (
    currentValue: number | null,
    currentObs: string,
  ) => {
    if (props.readOnly) return;
    if (currentValue === 0 && (!currentObs || currentObs.trim() === '')) {
      setSaveStatus('idle');
      return;
    }

    if (isMounted.current) setSaveStatus('saving');

    try {
      await props.onSave({
        id: props.id,
        value: currentValue,
        observation: currentObs,
        featureId: props.featureId,
        inspectionId: props.inspectionId,
      });
      if (isMounted.current) setSaveStatus('saved');
    } catch (error) {
      console.error(`Error en autoguardado del registro ${props.id}:`, error);
      if (isMounted.current) setSaveStatus('idle');
    }
  };

  const handleValueChange = (newValue: number | null) => {
    setvalue(newValue);
    if (isFirstRender.current) return;

    if (newValue === 0 && (!observation || observation.trim() === '')) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      return;
    }
    saveToServer(newValue, observation);
  };

  const handleObservationChange = (text: string) => {
    setObservation(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (value === 0 && (!text || text.trim() === '')) return;

    debounceTimer.current = setTimeout(() => {
      saveToServer(value, text);
    }, 800);
  };

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return {
    value,
    setvalue,
    observation,
    setObservation,
    saveStatus,
    fadeAnim,
    isValidationInvalid,
    handleValueChange,
    handleObservationChange,
  };
};
