import {createContext, type ReactNode, useCallback, useContext, useState} from 'react';

export type SnackbarType = 'success' | 'error' | 'warning';

interface SnackbarMessage {
    id: number;
    message: string;
    type: SnackbarType;
}

interface SnackbarContextType {
    showSnackbar: (message: string, type: SnackbarType) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

let snackbarId = 0;

export function SnackbarProvider({children}: { children: ReactNode }) {
    const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

    const removeSnackbar = useCallback((id: number) => {
        setSnackbars((prev) => prev.filter((s) => s.id !== id));
    }, []);

    const showSnackbar = useCallback((message: string, type: SnackbarType) => {
        const id = ++snackbarId;
        setSnackbars((prev) => [...prev, {id, message, type}]);

        setTimeout(() => {
            removeSnackbar(id);
        }, 4000);
    }, [removeSnackbar]);

    const showSuccess = useCallback((message: string) => showSnackbar(message, 'success'), [showSnackbar]);
    const showError = useCallback((message: string) => showSnackbar(message, 'error'), [showSnackbar]);
    const showWarning = useCallback((message: string) => showSnackbar(message, 'warning'), [showSnackbar]);

    const getTypeStyles = (type: SnackbarType) => {
        switch (type) {
            case 'success':
                return 'bg-green-600 text-white';
            case 'error':
                return 'bg-red-600 text-white';
            case 'warning':
                return 'bg-yellow-500 text-gray-900';
        }
    };

    const getIcon = (type: SnackbarType) => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                );
        }
    };

    return (
        <SnackbarContext.Provider value={{showSnackbar, showSuccess, showError, showWarning}}>
            {children}

            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {snackbars.map((snackbar) => (
                    <div
                        key={snackbar.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-in ${getTypeStyles(snackbar.type)}`}
                    >
                        {getIcon(snackbar.type)}
                        <span className="flex-1 text-sm font-medium">{snackbar.message}</span>
                        <button
                            onClick={() => removeSnackbar(snackbar.id)}
                            className="p-1 hover:opacity-80 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
}
