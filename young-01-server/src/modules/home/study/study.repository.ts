import { prisma } from '@/lib/prisma/prisma';

import { Topic, TopicTree } from '@shared/types/study/study.types';

const findTree = async () => {
    const findNodes = await prisma.topic.findMany({
        where: { isUse: true },
        orderBy: { depth: 'asc', sortOrder: 'asc' },
    });
    console.log('findNodes', findNodes);
    // 재귀 방식
    function buildTreeRec(nodes: Topic[], parentId: number | null = null): any[] {
        return nodes
            .filter((node) => node.parentId === parentId)
            .map((node) => ({
                ...node,
                children: buildTreeRec(nodes, node.id),
            }));
    }

    // 트리구조 생성
    function buildTree(nodes: Topic[]) {
        const map = new Map();
        const roots: Array<TopicTree> = [];
        //depth 순서 모를때
        // nodes.forEach((n) => map.set(n.id, { ...n, children: [] }));
        // nodes.forEach((n) => {
        //     if (n.parentId === null) {
        //         roots.push(map.get(n.id));
        //     } else {
        //         const parent = map.get(n.parentId);
        //         if (parent) parent.children.push(map.get(n.id));
        //     }
        // });

        //depth 순서 오름차순일때
        nodes.forEach((node) => {
            const treeNode = { ...node, children: [] };
            map.set(node.id, treeNode);

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

    return buildTree(findNodes);
};

const studyRepo = {
    findTree,
};

export default studyRepo;
