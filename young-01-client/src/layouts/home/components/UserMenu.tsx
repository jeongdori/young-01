// src/layouts/components/UserMenu.jsx
import {
    Avatar,
    ListItemIcon,
    Divider,
    Menu,
    MenuItem,
    Stack,
    Typography,
    IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import { useState } from 'react';
import useAuthStore from '@/stores/auth/authStore';
import useLogout from '@/features/auth/hook/useLogout';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
    const { user } = useAuthStore();
    const logout = useLogout();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);

    const handleMyPage = () => {
        handleClose();
        navigate('/mypage');
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    return (
        <>
            <IconButton onClick={handleOpen} sx={{ ml: 2 }}>
                <Avatar alt={user.name} sx={{ width: 32, height: 32 }}>
                    {user.name?.charAt(0) || 'U'}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Stack spacing={0.5} sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email}
                    </Typography>
                </Stack>

                <Divider sx={{ my: 1, mx: 1 }} />

                <MenuItem onClick={handleMyPage}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    마이페이지
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    로그아웃
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
