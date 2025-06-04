import { useIsFetching } from '@tanstack/react-query';
import { Box, LinearProgress } from '@mui/material';

const GlobalLoader = () => {
    const isFetching = useIsFetching(); // 전체 useQuery 중 fetch 중인 개수

    if (!isFetching) return null;

    return (
        <Box sx={{ width: '100%', zIndex: 9999 }}>
            <LinearProgress color="primary" />
        </Box>
    );
};

export default GlobalLoader;
