import instance from '@/api/axios';
import useAuthStore from '@/stores/auth/authStore';
import { useNavigate } from 'react-router-dom';

import services from '../services';

const useLogout = () => {
    const logoutState = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await services.logout();
        } catch (err) {
            console.error('로그아웃 요청 실패:', err);
        } finally {
            logoutState();
            navigate('/login');
        }
    };

    return logout;
};

export default useLogout;
