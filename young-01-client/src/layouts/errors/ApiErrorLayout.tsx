import { useRef, useEffect } from 'react';

// store
import useErrorStore from '@/stores//error/errorStore';

// components
import UnauthorizedPage from './components/UnauthorizedPage';
import ForbiddenPage from './components/ForbiddenPage';
import NotFoundPage from './components/NotFoundPage';
import ServerErrorPage from './components/ServerErrorPage';
import UnknownErrorPage from './components/UnknownErrorPage';

const ApiErrorLayout = () => {
    const { error, clearError } = useErrorStore();
    const errorRef = useRef(error);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, []);

    if (!errorRef.current) return <UnknownErrorPage />;

    switch (errorRef.current.status) {
        case 401:
            return <UnauthorizedPage />;
        case 403:
            return <ForbiddenPage />;
        case 404:
            return <NotFoundPage />;
        case 500:
            return <ServerErrorPage />;
        default:
            return <UnknownErrorPage />;
    }
};

export default ApiErrorLayout;
