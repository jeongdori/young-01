import { TopicTree } from '@shared/types/study/study.types';

export type TreeAction =
    | { type: 'SET_TREE'; nodes: TopicTree[] }
    | { type: 'UPDATE_TITLE'; id: number; title: string }
    | { type: 'UPDATE_CONTENT'; id: number; content: string }
    | { type: 'UPDATE_SORT_ORDER'; id: number; sortOrder: number };

export const treeReducer = (state: TopicTree[], action: TreeAction): TopicTree[] => {
    const updateNode = (
        nodes: TopicTree[],
        id: number,
        updater: (node: TopicTree) => TopicTree,
    ): TopicTree[] => {
        return nodes.map((node) => {
            if (node.id === id) {
                return updater(node);
            }
            if (node.children) {
                return { ...node, children: updateNode(node.children, id, updater) };
            }
            return node;
        });
    };
    switch (action.type) {
        case 'SET_TREE':
            return action.nodes;
        case 'UPDATE_TITLE':
            return updateNode(state, action.id, (node) => ({ ...node, title: action.title }));
        case 'UPDATE_CONTENT':
            return updateNode(state, action.id, (node) => ({ ...node, content: action.content }));
        case 'UPDATE_SORT_ORDER':
            return updateNode(state, action.id, (node) => ({
                ...node,
                sortOrder: action.sortOrder,
            }));
        default:
            return state;
    }
};
