import { useState } from 'react';
import { Box, Typography, IconButton, Divider, TextField, Grid, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import { TopicTree } from '@shared/types/study/study.types';

interface Props {
    selectedNode: TopicTree | null;
    handleUpdateTitle: (id: number, value: string) => void;
    handleUpdateContent: (id: number, value: string) => void;
    setIsDrawerOpen: (isOpen: boolean) => void;
}

const TreeItemDrawer = ({
    selectedNode,
    handleUpdateTitle,
    handleUpdateContent,
    setIsDrawerOpen,
}: Props) => {
    // 상세 편집모드
    const [detailEditMode, setDetailEditMode] = useState(false);
    return (
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
                            value={selectedNode?.title}
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
                            onChange={(e) => {
                                if (selectedNode)
                                    handleUpdateTitle(selectedNode.id, e.target.value);
                            }}
                        />
                    ) : (
                        <Typography variant="h6">{selectedNode?.title}</Typography>
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
                    value={selectedNode?.content}
                    variant="standard" // 테두리 제거
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
                    onChange={(e) => {
                        if (selectedNode) handleUpdateContent(selectedNode.id, e.target.value);
                    }}
                />
            ) : (
                <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                    {selectedNode?.content}
                </Typography>
            )}
        </Box>
    );
};

export default TreeItemDrawer;
