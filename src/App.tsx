import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import './index.css';
import { ToastProvider } from './components/Toast/ToastProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ToastProvider>
        </QueryClientProvider>
    );
}

export default App;
