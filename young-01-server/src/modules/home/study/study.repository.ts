import { prisma } from '@/lib/prisma/prisma';

import { Topic, TopicAll, TopicTree, InsertTopic } from '@shared/types/study/study.types';

// 전체 트리
const findTree = async () => {
    const findNodes = await prisma.topic.findMany({
        select: {
            id: true,
            parentId: true,
            title: true,
            sortOrder: true,
            depth: true,
        },
        where: { isUse: true },
        orderBy: [{ depth: 'asc' }, { sortOrder: 'asc' }],
    });

    // 재귀 방식
    function buildTreeRec(nodes: TopicAll[], parentId: number | null = null): any[] {
        return nodes
            .filter((node) => node.parentId === parentId)
            .map((node) => ({
                ...node,
                children: buildTreeRec(nodes, node.id),
            }));
    }

    // 트리구조 생성
    function buildTree(nodes: TopicAll[]) {
        const map = new Map<number, TopicTree>();
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
    return findNodes;
    return buildTree(findNodes);
};

// 노드 상세
const findNode = async (id: number): Promise<Topic | null> => {
    return await prisma.topic.findUnique({
        where: { id, isUse: true },
    });
};

// 노드 생성
const insertNode = async (input: InsertTopic) => {
    // 부모 노드 조회 (depth 계산용)
    let depth = 0;
    if (input.parentId !== null) {
        const parent = await prisma.topic.findUnique({
            where: { id: input.parentId },
        });
        if (!parent) throw new Error('부모 노드가 존재하지 않습니다');
        depth = parent.depth + 1;

        // 부모 isLeaf false로 갱신
        if (parent.isLeaf) {
            await prisma.topic.update({
                where: { id: parent.id },
                data: { isLeaf: false },
            });
        }
    }

    // sortOrder 계산 (같은 부모 내 최대값 + 1)
    const maxOrder = await prisma.topic.aggregate({
        _max: { sortOrder: true },
        where: { parentId: input.parentId },
    });

    const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

    // 삽입
    const newNode = await prisma.topic.create({
        data: {
            parentId: input.parentId,
            depth,
            sortOrder,
            isLeaf: true,
        },
    });

    return newNode;
};

const studyRepo = {
    findTree,
    findNode,
    insertNode,
};

export default studyRepo;
