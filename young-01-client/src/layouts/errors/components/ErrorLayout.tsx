import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ErrorLayoutProps {
    code: number;
    title: string;
    message: string;
    buttonText?: string;
    redirectPath?: string;
}

const ErrorLayout = ({
    code,
    title,
    message,
    buttonText = '홈으로 이동',
    redirectPath = '/',
}: ErrorLayoutProps) => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
            px={2}
        >
            <Typography variant="h1" color="error" fontWeight="bold">
                {code}
            </Typography>
            <Typography variant="h5" mt={2}>
                {title}
            </Typography>
            <Typography variant="body1" mt={1} color="text.secondary">
                {message}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                onClick={() => navigate(redirectPath)}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default ErrorLayout;
