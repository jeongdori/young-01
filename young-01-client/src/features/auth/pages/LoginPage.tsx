import { useForm, FormProvider } from 'react-hook-form';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// util
import useLogin from '../hook/useLogin';

// types/schema
import { UserLoginInputDto } from '@shared/types/user/user.types';
import { loginSchema } from '@shared/types/user/user.schema';

// components
import FormError from '@/components/errors/FormError';

const LoginPage = () => {
    // ──────────────────────────────────────────────────────────────
    // constants

    // ──────────────────────────────────────────────────────────────
    // states/hook
    const form = useForm({
        mode: 'onSubmit',
        resolver: zodResolver(loginSchema),
    });
    const { handleSubmit, register } = form;

    const loginMutation = useLogin();

    // ──────────────────────────────────────────────────────────────
    // Derived Values

    // ──────────────────────────────────────────────────────────────
    // helpers

    // ──────────────────────────────────────────────────────────────
    // handlers

    // ──────────────────────────────────────────────────────────────
    // routing
    const navigate = useNavigate();
    const goToRegister = () => {
        navigate('/register');
    };

    // ──────────────────────────────────────────────────────────────
    // submit/api call
    const onLoginSubmit = (data: UserLoginInputDto) => {
        loginMutation.mutate(data);
    };

    // ──────────────────────────────────────────────────────────────
    //  Render Guards

    // ──────────────────────────────────────────────────────────────
    // jsx
    return (
        <Container maxWidth="xs">
            <Typography variant="h5" align="center" gutterBottom>
                Login
            </Typography>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onLoginSubmit)}>
                    <TextField label="Email" fullWidth margin="normal" {...register('email')} />
                    <FormError name="email" />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register('password')}
                    />
                    <FormError name="password" />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loginMutation.isPending}
                    >
                        로그인
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={goToRegister}
                        disabled={loginMutation.isPending}
                    >
                        회원가입
                    </Button>
                </form>
            </FormProvider>
        </Container>
    );
};

export default LoginPage;
