import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/styles/theme';
import Router from '@/router';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
