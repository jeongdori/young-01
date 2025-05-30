import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/stores/auth/useAuth';
import { importRSAPublicKey, encryptWithRSA } from '@/utils/rsaEncrypt';

import { AxiosError } from 'axios';
import { UserLoginInputDto } from '@shared/types/user/user.types';

import authService from '../services';

const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo =
        location.state?.from?.pathname || new URLSearchParams(location.search).get('redirect') || '/main';

    return useMutation({
        mutationFn: async (data: UserLoginInputDto) => {
            const pkData = await authService.getPublicKey();
            const publicKey = await importRSAPublicKey(pkData.publicKey);

            const encryptedPassword = await encryptWithRSA(publicKey, data.password);

            return authService.login({
                email: data.email,
                password: encryptedPassword,
            });
        },
        onSuccess: (res) => {
            useAuth.getState().login(res);
            navigate(redirectTo, {
                replace: true,
            });
        },
        onError: (error: AxiosError) => {
            const status = error.response?.status;
            const message = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.';

            console.error(`STATUS: ${status} | MESSAGE: ${message}`);
            alert(`[${status}] 로그인 실패: ${message}`);
        },
    });
};

export default useLogin;
