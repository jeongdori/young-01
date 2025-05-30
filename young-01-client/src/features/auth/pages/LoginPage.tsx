import { useForm, FormProvider } from 'react-hook-form';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { joiResolver } from '@hookform/resolvers/joi';

import FormError from '@/components/errors/FormError';

import useLogin from '../hook/useLogin';
import { loginSchema } from '../schemas/user.schema';

const LoginPage = () => {
    const methods = useForm({
        mode: 'onSubmit',
        resolver: joiResolver(loginSchema),
    });
    const { handleSubmit, register } = methods;

    const navigate = useNavigate();

    const loginMutation = useLogin();

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };

    const onRegisterClick = () => {
        navigate('/register');
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h5" align="center" gutterBottom>
                Login
            </Typography>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField label="Email" fullWidth margin="normal" {...register('email')} />
                    <FormError name="email" />
                    <TextField label="Password" type="password" fullWidth margin="normal" {...register('password')} />
                    <FormError name="password" />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loginMutation.isLoading}
                    >
                        로그인
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={onRegisterClick}
                        disabled={loginMutation.isLoading}
                    >
                        회원가입
                    </Button>
                </form>
            </FormProvider>
        </Container>
    );
};

export default LoginPage;
