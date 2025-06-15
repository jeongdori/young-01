// src/components/common/ScrollTop.tsx
import { useEffect, useState } from 'react';
import { Tooltip, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollTop = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShow(window.scrollY > 200);
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return show ? (
        <Tooltip title="맨 위로">
            <Fab
                size="small"
                color="primary"
                onClick={handleClick}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Tooltip>
    ) : null;
};

export default ScrollTop;
