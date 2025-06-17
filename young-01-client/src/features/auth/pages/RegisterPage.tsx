import { useForm, FormProvider } from 'react-hook-form';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// util
import { useMutation } from '@/lib/QueryClient';
import authService from '../auth.service';

// types/schema
import { UserRegisterDto } from '@shared/types/user/user.types';
import { registerSchema } from '@shared/types/user/user.schema';

// components
import FormError from '@/components/errors/FormError';

const RegisterPage = () => {
    // ──────────────────────────────────────────────────────────────
    // constants

    // ──────────────────────────────────────────────────────────────
    // hook form
    const methods = useForm({
        mode: 'onSubmit',
        resolver: zodResolver(registerSchema),
    });
    const { handleSubmit, register } = methods;

    const mutation = useMutation<null, UserRegisterDto>({
        mutationFn: authService.register,
        onSuccess: () => {
            alert('회원가입 완료! 로그인해주세요.');
            goToLogin();
        },
    });

    // ──────────────────────────────────────────────────────────────
    // Derived Values

    // ──────────────────────────────────────────────────────────────
    // helpers

    // ──────────────────────────────────────────────────────────────
    // handler

    // ──────────────────────────────────────────────────────────────
    // routing
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login');
    };

    // ──────────────────────────────────────────────────────────────
    // submit/api call
    const onRegisterSubmit = (data: UserRegisterDto) => {
        mutation.mutate(data);
    };

    // ──────────────────────────────────────────────────────────────
    //  Render Guards

    // ──────────────────────────────────────────────────────────────
    // jsx
    return (
        <Container maxWidth="xs">
            <Typography variant="h5" align="center" gutterBottom>
                회원가입
            </Typography>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onRegisterSubmit)}>
                    <TextField label="이메일" fullWidth margin="normal" {...register('email')} />
                    <FormError name="email" />

                    <TextField
                        label="비밀번호"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register('password')}
                    />
                    <FormError name="password" />

                    <TextField label="이름" fullWidth margin="normal" {...register('name')} />
                    <FormError name="name" />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={mutation.isPending}
                    >
                        회원가입
                    </Button>
                </form>
            </FormProvider>
        </Container>
    );
};

export default RegisterPage;
