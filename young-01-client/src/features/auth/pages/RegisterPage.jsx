import { useForm, FormProvider } from "react-hook-form";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { joiResolver } from "@hookform/resolvers/joi";

import FormError from "@/components/FormError";

import authService from "../services";
import { registerSchema } from "../schemas/user.schema";

const RegisterPage = () => {
  const methods = useForm({
    mode: "onSubmit",
    resolver: joiResolver(registerSchema),
  });
  const { handleSubmit, register } = methods;
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      alert("회원가입 완료! 로그인해주세요.");
      navigate("/login");
    },
    onError: (error) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
      alert(`[${status}] 회원가입 실패: ${message}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        회원가입
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="이메일"
            fullWidth
            margin="normal"
            {...register("email")}
          />
          <FormError name="email" />

          <TextField
            label="비밀번호"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")}
          />
          <FormError name="password" />

          <TextField
            label="이름"
            fullWidth
            margin="normal"
            {...register("name")}
          />
          <FormError name="name" />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={mutation.isLoading}
          >
            회원가입
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
};

export default RegisterPage;
