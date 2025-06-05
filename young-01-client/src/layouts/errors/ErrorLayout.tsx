import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

// components
import UnauthorizedPage from './components/UnauthorizedPage';
import ForbiddenPage from './components/ForbiddenPage';
import NotFoundPage from './components/NotFoundPage';
import ServerErrorPage from './components/ServerErrorPage';
import UnknownErrorPage from './components/UnknownErrorPage';

const ErrorLayout = () => {
    const routeError = useRouteError();

    if (isRouteErrorResponse(routeError)) {
        switch (routeError.status) {
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
    }

    return <UnknownErrorPage />;
};

export default ErrorLayout;
