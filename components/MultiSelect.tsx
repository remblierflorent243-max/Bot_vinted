import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (e: React.MouseEvent, option: string) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="relative min-w-[200px]" ref={containerRef}>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-vinted-dark border border-gray-700 rounded-lg min-h-[38px] px-2 py-1 flex flex-wrap items-center gap-2 cursor-pointer hover:border-vinted-teal transition-colors"
      >
        {selected.length === 0 && (
          <span className="text-sm text-gray-500 px-1">Any</span>
        )}
        
        {selected.map(item => (
          <span key={item} className="bg-vinted-teal/20 text-vinted-teal border border-vinted-teal/30 text-xs rounded px-2 py-1 flex items-center gap-1">
            {item}
            <button 
              onClick={(e) => removeOption(e, item)}
              className="hover:text-white transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        
        <div className="ml-auto text-gray-500">
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-vinted-card border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map(option => (
            <div 
              key={option}
              onClick={() => toggleOption(option)}
              className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(option) ? 'bg-vinted-teal border-vinted-teal' : 'border-gray-600'}`}>
                {selected.includes(option) && <X size={10} className="text-black" />}
              </div>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};