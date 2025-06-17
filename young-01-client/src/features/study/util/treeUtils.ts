import { TopicTree } from '@shared/types/study/study.types';

export function findNodeById(nodes: TopicTree[], id: number): TopicTree | null {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}
