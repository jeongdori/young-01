import { useForm, FormProvider } from "react-hook-form";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import useAuth from "@/stores/auth/useAuth";
import FormError from "@/components/FormError";

import useLogin from "../hook/useLogin";

const LoginPage = () => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {},
  });
  const { handleSubmit, register } = methods;
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  const onRegisterClick = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", { required: "이메일은 필수입니다" })}
          />
          <FormError name="email" />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "비밀번호는 필수입니다",
            })}
          />
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
