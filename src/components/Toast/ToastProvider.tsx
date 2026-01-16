import React, { createContext, useContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { Toast } from 'primereact/toast';

type ShowFn = (detail?: string, summary?: string, life?: number) => void;

type ToastContextValue = {
    showSuccess: ShowFn;
    showInfo: ShowFn;
    showWarn: ShowFn;
    showError: ShowFn;
    showSecondary: ShowFn;
    showContrast: ShowFn;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const toastRef = useRef<any>(null);

    const showSuccess: ShowFn = (detail = '', summary = 'Éxito', life = 3000) =>
        toastRef.current?.show({ severity: 'success', summary, detail, life, className: 'app-toast-glass' });

    const showInfo: ShowFn = (detail = '', summary = 'Información', life = 3000) =>
        toastRef.current?.show({ severity: 'info', summary, detail, life, className: 'app-toast-glass' });

    const showWarn: ShowFn = (detail = '', summary = 'Atención', life = 3000) =>
        toastRef.current?.show({ severity: 'warn', summary, detail, life, className: 'app-toast-glass' });

    const showError: ShowFn = (detail = '', summary = 'Error', life = 4000) =>
        toastRef.current?.show({ severity: 'error', summary, detail, life, className: 'app-toast-glass' });

    // `secondary` and `contrast` son severities válidas en PrimeReact según la documentación oficial
    const showSecondary: ShowFn = (detail = '', summary = 'Secundario', life = 3000) =>
        toastRef.current?.show({ severity: 'secondary', summary, detail, life, className: 'app-toast-glass' });

    const showContrast: ShowFn = (detail = '', summary = 'Contraste', life = 3000) =>
        toastRef.current?.show({ severity: 'contrast', summary, detail, life, className: 'app-toast-glass' });

    return (
        <ToastContext.Provider
            value={{ showSuccess, showInfo, showWarn, showError, showSecondary, showContrast }}
        >
            {/* Toast de PrimeReact; referenciado por las funciones anteriores */}
            <Toast
                ref={toastRef}
                position="top-right"
                appendTo={document.body}
                className="app-toast"
            />
            {children}
        </ToastContext.Provider>
    );
};

export const useAppToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useAppToast must be used within ToastProvider');
    return ctx;
};

export default ToastProvider;
