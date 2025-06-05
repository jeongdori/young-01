import { createBrowserRouter, Navigate } from 'react-router-dom';

import HomeLayout from '@/layouts/home/HomeLayout';
import ErrorLayout from '@/layouts/errors/ErrorLayout';
import ApiErrorLayout from '@/layouts/errors/ApiErrorLayout';

import App from '@/App';
import mainRoutes from './main.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const routes = createBrowserRouter([
    {
        element: <App />,
        errorElement: <ErrorLayout />,
        children: [
            {
                element: <HomeLayout />,
                children: [
                    { path: '/', element: <Navigate to="/main" replace /> },

                    ...mainRoutes,
                    ...authRoutes,
                    ...userRoutes,
                ],
            },
        ],
    },
    {
        path: '/error',
        element: <ApiErrorLayout />,
    },
    // {
    //     path: '*',
    //     element: <ErrorBoundaryLayout />,
    // },
]);

export default routes;
