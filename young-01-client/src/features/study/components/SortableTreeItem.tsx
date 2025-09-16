import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Typography, TextField } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useMutation } from '@/lib/QueryClient';

import { TopicTree } from '@shared/types/study/study.types';

import studyService from '../study.service';

interface Props {
    node: TopicTree;
    isOpen: boolean | undefined;
    editMode: boolean;
    toggleNode: (id: number) => void;
    handleSelectNode: (node: TopicTree) => void;
    searchKeyword: string;
    handleUpdateTitle: (id: number, title: string) => void;
    handleAddNode: (parentId: number) => void;
    handleDeleteNode: (id: number) => void;
}

const SortableTreeItem = ({
    node,
    isOpen,
    editMode,
    toggleNode,
    handleSelectNode,
    searchKeyword,
    handleUpdateTitle,
    handleAddNode,
    handleDeleteNode,
}: Props) => {
    // ──────────────────────────────────────────────────────────────
    // hook form
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: node.id,
    });

    // const nodeInsertMutation = useMutation<number, TopicTree>({
    //     mutationFn: async (data) => {
    //         if (data.parentId == null) {
    //             throw new Error('추가 될 노드를 찾을 수 없습니다.');
    //         }
    //         return studyService.insertNode(data.parentId, [
    //             {
    //                 parentId: data.parentId,
    //                 depth: data.depth,
    //                 sortOrder: data.sortOrder,
    //             },
    //         ]);
    //     },
    //     onSuccess(data, variables, context) {},
    // });

    // ──────────────────────────────────────────────────────────────
    // handler
    // const handleAddNode = (node: TopicTree) => {
    //     nodeInsertMutation.mutate(node);
    // };

    return (
        <Box
            ref={setNodeRef}
            sx={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                cursor: editMode ? 'grab' : 'default',
                pl: `${node.depth * 2}rem`,
                borderLeft: node.depth > 0 ? '1px solid #ccc' : 'none',
                mb: 2,
            }}
            {...attributes}
            {...listeners}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {
                    <IconButton size="small" onClick={() => toggleNode(node.id)} sx={{ p: 0.5 }}>
                        {isOpen ? <ExpandMore /> : <ChevronRight />}
                    </IconButton>
                }
                {editMode ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={() => handleAddNode(node.id)}
                            sx={{ p: 0.5 }}
                        >
                            <AddIcon />
                        </IconButton>
                        <TextField
                            size="small"
                            value={node.title}
                            onChange={(e) => handleUpdateTitle(node.id, e.target.value)}
                            variant="standard" // 테두리 제거
                            fullWidth
                            inputProps={{
                                maxLength: 200,
                                style: {
                                    fontSize: `${Math.max(2 - node.depth * 0.2, 0.85)}rem`,
                                    fontWeight: 'bold',
                                    padding: 0,
                                },
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => handleDeleteNode(node.id)}
                            sx={{ p: 0.5 }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <Box>
                        <Typography
                            onClick={() => handleSelectNode(node)}
                            sx={{
                                fontSize: `${Math.max(2 - node.depth * 0.2, 0.85)}rem`,
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                                backgroundColor:
                                    searchKeyword && node.title?.includes(searchKeyword)
                                        ? 'yellow'
                                        : 'inherit',
                            }}
                        >
                            {node.title}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
const SortableTreeItemMemo = React.memo(SortableTreeItem);

export default SortableTreeItemMemo;
