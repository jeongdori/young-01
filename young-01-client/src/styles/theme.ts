import { createTheme } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

const theme = createTheme(
    {
        palette: {
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
        },
    },
    koKR
);

export default theme;
