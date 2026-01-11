import type { ChangeEvent } from 'react';

export interface InputBaseProps {
    label?: string;
    name: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export interface InputTextProps extends InputBaseProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    autoComplete?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface InputFileProps extends InputBaseProps {
    onChange: (file: File | null) => void;
    accept?: string;
    preview?: string;
    maxSize?: number;
    allowedExtensions?: string[];
}

export interface InputTextAreaProps extends InputBaseProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface InputSelectProps extends InputBaseProps {
    value: string | number;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    placeholder?: string;
}