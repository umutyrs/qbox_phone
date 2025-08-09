import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppProps } from '../../types/App';

export const CalculatorApp: React.FC<AppProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      case '=': return secondValue;
      default: return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const Button: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = 
    ({ onClick, className = '', children }) => (
      <button
        onClick={onClick}
        className={`h-16 rounded-2xl font-semibold text-xl active:scale-95 transition-transform ${className}`}
      >
        {children}
      </button>
    );

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header */}
      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <button onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold">MathPro</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Display */}
      <div className="flex-1 flex items-end justify-end p-6">
        <div className="text-right">
          <div className="text-5xl font-light mb-2 min-h-[60px] flex items-end justify-end">
            {display}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-6 grid grid-cols-4 gap-4">
        {/* Row 1 */}
        <Button onClick={clear} className="bg-gray-600 text-black">AC</Button>
        <Button onClick={() => {}} className="bg-gray-600 text-black">±</Button>
        <Button onClick={() => {}} className="bg-gray-600 text-black">%</Button>
        <Button onClick={() => inputOperation('÷')} className="bg-orange-500">÷</Button>

        {/* Row 2 */}
        <Button onClick={() => inputNumber('7')} className="bg-gray-800">7</Button>
        <Button onClick={() => inputNumber('8')} className="bg-gray-800">8</Button>
        <Button onClick={() => inputNumber('9')} className="bg-gray-800">9</Button>
        <Button onClick={() => inputOperation('×')} className="bg-orange-500">×</Button>

        {/* Row 3 */}
        <Button onClick={() => inputNumber('4')} className="bg-gray-800">4</Button>
        <Button onClick={() => inputNumber('5')} className="bg-gray-800">5</Button>
        <Button onClick={() => inputNumber('6')} className="bg-gray-800">6</Button>
        <Button onClick={() => inputOperation('-')} className="bg-orange-500">−</Button>

        {/* Row 4 */}
        <Button onClick={() => inputNumber('1')} className="bg-gray-800">1</Button>
        <Button onClick={() => inputNumber('2')} className="bg-gray-800">2</Button>
        <Button onClick={() => inputNumber('3')} className="bg-gray-800">3</Button>
        <Button onClick={() => inputOperation('+')} className="bg-orange-500">+</Button>

        {/* Row 5 */}
        <Button onClick={() => inputNumber('0')} className="bg-gray-800 col-span-2">0</Button>
        <Button onClick={() => inputNumber('.')} className="bg-gray-800">.</Button>
        <Button onClick={performCalculation} className="bg-orange-500">=</Button>
      </div>
    </div>
  );
};