import { Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/styles/theme';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Outlet />
        </ThemeProvider>
    );
};

export default App;
