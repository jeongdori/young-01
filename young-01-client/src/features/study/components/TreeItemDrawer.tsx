import { useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    TextField,
    Grid,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import { useQuery } from '@/lib/QueryClient';

import { Topic } from '@shared/types/study/study.types';

import studyService from '../study.service';

interface Props {
    selectedNodeId: number | null;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
}

const TreeItemDrawer = ({ selectedNodeId, isDrawerOpen, setIsDrawerOpen }: Props) => {
    // ──────────────────────────────────────────────────────────────
    // hook form
    // 상세 편집모드
    const [detailEditMode, setDetailEditMode] = useState(false);

    // 트리 가져오기
    const { data } = useQuery({
        queryKey: ['study', 'findNode'],
        queryFn: () => studyService.findNode(selectedNodeId!),
        enabled: !!selectedNodeId,
        retry: false,
    });

    // ──────────────────────────────────────────────────────────────
    // handler

    return (
        <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{ sx: { width: 360 } }}
        >
            <Box sx={{ p: 2 }}>
                <Grid
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Grid size={8}>
                        {detailEditMode ? (
                            <TextField
                                size="small"
                                value={data?.title}
                                variant="standard" // 테두리 제거
                                fullWidth
                                inputProps={{
                                    maxLength: 200,
                                }}
                                slotProps={{
                                    input: {
                                        style: {
                                            fontSize: '1.25rem', // Typography variant="h6"와 유사
                                            fontWeight: 500,
                                            padding: 0,
                                        },
                                    },
                                }}
                                onChange={(e) => {}}
                            />
                        ) : (
                            <Typography variant="h6">{data?.title}</Typography>
                        )}
                    </Grid>
                    <Grid size={4}>
                        <Tooltip title={detailEditMode ? '저장' : '편집'}>
                            <IconButton
                                color={detailEditMode ? 'primary' : 'secondary'}
                                onClick={() => setDetailEditMode(!detailEditMode)}
                            >
                                {detailEditMode ? <SaveIcon /> : <EditIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="닫기">
                            <IconButton onClick={() => setIsDrawerOpen(false)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                {detailEditMode ? (
                    <TextField
                        size="small"
                        value={data?.content}
                        variant="standard" // 테두리 제거
                        label="내용"
                        placeholder="내용"
                        fullWidth
                        multiline
                        inputProps={{
                            maxLength: 200,
                        }}
                        slotProps={{
                            input: {
                                style: {
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.875rem',
                                },
                            },
                        }}
                        onChange={(e) => {}}
                    />
                ) : (
                    <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                        {data?.content}
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
};

export default TreeItemDrawer;
