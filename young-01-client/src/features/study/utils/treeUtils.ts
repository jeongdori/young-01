import { TopicAll, TopicTree } from '@shared/types/study/study.types';

/**
 * id에 해당하는 node찾기
 * @param nodes 트리노드
 * @param id 찾는 node.id
 * @returns
 */
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

/**
 * 플랫데이터 트리구조로 변환
 * @param flatNodes 트리구조로 만들고싶은 플랫 데이터
 * @returns
 */
export function buildTree(flatNodes: TopicAll[]): TopicTree[] {
    const map = new Map<number, TopicTree>();
    const roots: TopicTree[] = [];

    // 1. Map 생성
    flatNodes.forEach((node) => {
        map.set(node.id, { ...node, children: [] });
    });

    // 2. 부모-자식 연결
    flatNodes.forEach((node) => {
        const treeNode = map.get(node.id)!;
        if (node.parentId === null) {
            roots.push(treeNode);
        } else {
            const parent = map.get(node.parentId);
            if (parent) {
                parent.children.push(treeNode);
            }
        }
    });

    return roots;
}

/**
 * 플랫데이터 플랫 Map데이터, 트리구조 변환
 * @param flatNodes 트리구조로 만들고싶은 플랫 데이터
 * @returns
 */
export function buildTreeWithMap(flatNodes: TopicAll[]) {
    const map = new Map<number, TopicTree>();
    const idNodeMap = new Map<number, TopicTree>();
    const roots: TopicTree[] = [];

    // 1. Map 초기화
    flatNodes.forEach((node) => {
        const treeNode: TopicTree = { ...node, children: [] };
        map.set(node.id, treeNode);
        idNodeMap.set(node.id, treeNode);
    });

    // 2. 부모-자식 연결
    flatNodes.forEach((node) => {
        const treeNode = map.get(node.id)!;
        if (node.parentId === null) {
            roots.push(treeNode);
        } else {
            const parent = map.get(node.parentId);
            if (parent) {
                parent.children.push(treeNode);
            }
        }
    });

    return { roots, idNodeMap };
}

/**
 * 트리 데이터에서 키워드를 포함하는 id와 이 id의 부모 id 찾기
 * @param nodeMap 조회할 트리 데이터
 * @param keyword 조죄할 title 키워드
 * @returns
 */
export const findMatchedAndParentIds = (nodeMap: Map<number, TopicTree>, keyword: string) => {
    const matchedIds = new Set<number>();
    const openParentIds = new Set<number>();

    if (!keyword.trim()) return { matchedIds, openParentIds };

    nodeMap.forEach((node) => {
        if (node.title?.includes(keyword)) {
            matchedIds.add(node.id);
            // 부모 chain 열기
            let currentParentId = node.parentId;
            while (currentParentId !== null) {
                openParentIds.add(currentParentId);
                currentParentId = nodeMap.get(currentParentId)?.parentId ?? null;
            }
        }
    });
    return { matchedIds, openParentIds };
};

/**
 * 원본, 현재 데이터를 비교하여 데이터 반환
 * @param originalMap 원본 데이터
 * @param currentMap 현재 데이터
 * @returns
 */
export const diffNodes = (
    originalMap: Map<number, TopicAll>,
    currentMap: Map<number, TopicTree>,
) => {
    const currentFlat = Array.from(currentMap.values());

    const added = currentFlat.filter((c) => !originalMap.has(c.id));
    const deleted = Array.from(originalMap.values()).filter((o) => !currentMap.has(o.id));
    const updated = currentFlat.filter((c) => {
        const o = originalMap.get(c.id);
        return (
            o && (o.title !== c.title || o.sortOrder !== c.sortOrder || o.parentId !== c.parentId)
        );
    });

    return { added, deleted, updated };
};
