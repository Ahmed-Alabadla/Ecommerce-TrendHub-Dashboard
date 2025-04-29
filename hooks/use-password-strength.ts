
import { useState, useEffect } from 'react';

type PasswordStrength = 'weak' | 'medium' | 'strong' | '';

export function usePasswordStrength(password: string = '') {
  const [strength, setStrength] = useState<PasswordStrength>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!password) {
      setStrength('');
      setMessage('');
      return;
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strengthChecks = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars, isLongEnough];
    const passedChecks = strengthChecks.filter(Boolean).length;

    if (passedChecks <= 2) {
      setStrength('weak');
      setMessage('Weak password');
    } else if (passedChecks <= 4) {
      setStrength('medium');
      setMessage('Medium strength password');
    } else {
      setStrength('strong');
      setMessage('Strong password');
    }
  }, [password]);

  const getColor = () => {
    switch(strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPercentage = () => {
    switch(strength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
    }
  };

  return { strength, message, getColor, getPercentage };
}
