import { Box, Typography } from '@mui/material';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';

type TreeNode<T> = {
    id: number | string;
    title: string;
    children?: T[];
};

interface MenuTreeProps<T extends TreeNode<T>> {
    data: T[];
    minHeight?: number;
    minWidth?: number;
}

// const MenuTree: React.FC<MenuTreeProps> = ({ data, minHeight, minWidth }) => {
const MenuTree = <T extends TreeNode<T>>({
    data,
    minHeight = 352,
    minWidth = 250,
}: MenuTreeProps<T>) => {
    const renderTree = (nodes: T[]) =>
        nodes.map((node) => (
            <TreeItem
                key={node.id}
                itemId={String(node.id)}
                label={
                    <Box>
                        <Typography fontWeight="bold">{node.title}</Typography>
                    </Box>
                }
            >
                {node.children && Array.isArray(node.children) ? renderTree(node.children) : null}
            </TreeItem>
        ));

    return (
        <Box sx={{ minHeight: minHeight ?? 352, minWidth: minWidth ?? 250 }}>
            <SimpleTreeView>{renderTree(data)}</SimpleTreeView>
        </Box>
    );
};

export default MenuTree;
