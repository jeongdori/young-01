import { useMutation } from '@/lib/QueryClient';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/auth/authStore';
import { importRSAPublicKey, encryptWithRSA } from '@/utils/rsaEncrypt';

import { UserLoginDto, UserLoginInputDto } from '@shared/types/user/user.types';

import authService from '../services';

const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo =
        location.state?.from?.pathname ||
        new URLSearchParams(location.search).get('redirect') ||
        '/main';

    return useMutation<UserLoginDto, UserLoginInputDto>({
        mutationFn: async (data) => {
            const pkData = await authService.getPublicKey();
            const publicKey = await importRSAPublicKey(pkData.publicKey);

            const encryptedPassword = await encryptWithRSA(publicKey, data.password);

            return authService.login({
                email: data.email,
                password: encryptedPassword,
            });
        },
        onSuccess: (res) => {
            useAuthStore.getState().login(res);
            navigate(redirectTo, {
                replace: true,
            });
        },
    });
};

export default useLogin;
