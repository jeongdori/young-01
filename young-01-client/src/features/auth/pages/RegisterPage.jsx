import { useForm } from "react-hook-form";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import authService from "../services";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="이메일"
          fullWidth
          margin="normal"
          {...register("email")}
        />
        <TextField
          label="이름"
          fullWidth
          margin="normal"
          {...register("name")}
        />
        <TextField
          label="비밀번호"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={mutation.isLoading}
        >
          가입하기
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPage;
