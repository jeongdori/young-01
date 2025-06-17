import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Typography, TextField } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { TopicTree } from '@shared/types/study/study.types';

interface Props {
    node: TopicTree;
    isOpen: boolean | undefined;
    editMode: boolean;
    toggleNode: (id: number) => void;
    handleSelectNode: (node: TopicTree) => void;
    searchKeyword: string;
    handleUpdateTitle: (id: number, title: string) => void;
}

const SortableTreeItem = ({
    node,
    isOpen,
    editMode,
    toggleNode,
    handleSelectNode,
    searchKeyword,
    handleUpdateTitle,
}: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: node.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <Box
            ref={setNodeRef}
            sx={{
                ...style,
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
                    <TextField
                        size="small"
                        value={node.title}
                        variant="standard" // 테두리 제거
                        fullWidth
                        inputProps={{
                            maxLength: 200,
                        }}
                        slotProps={{
                            input: {
                                style: {
                                    fontSize: `${Math.max(2 - node.depth * 0.2, 0.85)}rem`,
                                    fontWeight: 'bold',
                                    padding: 0,
                                },
                            },
                        }}
                        onChange={(e) => handleUpdateTitle(node.id, e.target.value)}
                    />
                ) : (
                    <Typography
                        onClick={() => handleSelectNode(node)}
                        sx={{
                            fontSize: `${Math.max(2 - node.depth * 0.2, 0.85)}rem`,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                            backgroundColor:
                                searchKeyword && node.title.includes(searchKeyword)
                                    ? 'yellow'
                                    : 'inherit',
                        }}
                    >
                        {node.title}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default SortableTreeItem;
