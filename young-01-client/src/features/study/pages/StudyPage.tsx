import { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import {
    Box,
    Container,
    IconButton,
    Divider,
    TextField,
    InputAdornment,
    Stack,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLessDouble';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Dnd kit
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { useQuery } from '@/lib/QueryClient';

import SortableTreeItemMemo from '../components/SortableTreeItem';
import TreeItemDrawer from '../components/TreeItemDrawer';

import { TopicAll, TopicTree } from '@shared/types/study/study.types';

// hook
import useTreeOpenState from '../hook/useTreeOpenState';

// util
import { buildTreeWithMap, findMatchedAndParentIds, diffNodes } from '../utils/treeUtils';
import studyService from '../study.service';

const StudyPage = () => {
    // ──────────────────────────────────────────────────────────────
    // constants

    // ──────────────────────────────────────────────────────────────
    // hook form

    // 트리 가져오기
    const { data: flatNodes } = useQuery({
        queryKey: ['study', 'findTree'],
        queryFn: studyService.findTree,
        retry: false,
    });
    // 데이터
    const [originalNodeMap, setOriginalNodeMap] = useState<Map<number, TopicTree>>(new Map());
    const [nodeMap, setNodeMap] = useState<Map<number, TopicTree>>(new Map());
    const [treeNodes, setTreeNodes] = useState<TopicTree[]>([]);

    useEffect(() => {
        if (!flatNodes) return;
        const { roots, idNodeMap } = buildTreeWithMap(flatNodes);

        setOriginalNodeMap(new Map(idNodeMap));
        setNodeMap(new Map(idNodeMap));
        setTreeNodes(roots);
    }, [flatNodes]);

    // 화면 편집모드
    const [editMode, setEditMode] = useState(false);

    // 펼치기 & 접기
    const [openMap, setOpenMap] = useTreeOpenState();

    // 선택 시 상세보기
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

    // drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 검색 input value
    const [searchInput, setSearchInput] = useState('');
    // 검색 키워드
    const [searchKeyword, setSearchKeyword] = useState('');

    // 노드가 하나라도 열려있는지 여부
    const isExpanded = useMemo(() => {
        return Array.from(openMap.values()).some((v) => v);
    }, [treeNodes, openMap]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px 이상 움직여야 drag 시작
            },
        }),
    );

    // ──────────────────────────────────────────────────────────────
    // Derived Values

    // ──────────────────────────────────────────────────────────────
    // helpers

    const addNode = useCallback(
        (id: number) => {
            const node = nodeMap.get(id);

            if (!node) return;
            console.log('2');
            const newId = Date.now(); // 임시 ID (DB에서 id 반환받으면 갱신)
            const newNode: TopicTree = {
                id: newId,
                parentId: node.id,
                title: '새 노드',
                sortOrder: 99,
                depth: node.depth + 1,
                children: [],
            };
            console.log('3');

            node.children.push(newNode);
            nodeMap.set(newId, newNode);

            setTreeNodes([...treeNodes]);
        },
        [nodeMap, treeNodes],
    );

    const deleteNode = useCallback(
        (id: number) => {
            const node = nodeMap.get(id);
            if (!node || node.parentId === null) return; // 루트 삭제 방지

            const parent = nodeMap.get(node.parentId);
            if (!parent) return;

            parent.children = parent.children.filter((c) => c.id !== id);
            nodeMap.delete(id);
            setTreeNodes([...treeNodes]);
        },
        [nodeMap, treeNodes],
    );

    const saveNodes = useCallback(() => {
        const { added, deleted, updated } = diffNodes(originalNodeMap, nodeMap);

        console.log('added', added);
        console.log('deleted', deleted);
        console.log('updated', updated);

        // await studyService.bulkInsert(added);
        // await studyService.bulkDelete(deleted.map(d => d.id));
        // await studyService.bulkUpdate(updated);
    }, [originalNodeMap, nodeMap]);

    const renderDocument = (treeNodes: TopicTree[]) => {
        return (
            <SortableContext
                items={treeNodes.map((n) => n.id)}
                strategy={verticalListSortingStrategy}
            >
                {treeNodes.map((node) => {
                    const isOpen = openMap.get(node.id);
                    const hasChildren = node.children && node.children.length > 0;

                    return (
                        <Box
                            key={node.id}
                            sx={{
                                pl: `2rem`,
                                borderLeft: node.depth > 0 ? '1px solid #ccc' : 'none',
                                mb: 2,
                            }}
                        >
                            <SortableTreeItemMemo
                                node={node}
                                isOpen={isOpen}
                                editMode={editMode}
                                toggleNode={toggleNode}
                                handleSelectNode={handleSelectNode}
                                searchKeyword={searchKeyword}
                                handleUpdateTitle={handleUpdateTitle}
                                handleAddNode={handleAddNode}
                                handleDeleteNode={handleDeleteNode}
                            />
                            {hasChildren && isOpen && renderDocument(node.children)}
                        </Box>
                    );
                })}
            </SortableContext>
        );
    };

    // ──────────────────────────────────────────────────────────────
    // handler

    // 펼치기 & 접기 토글
    const toggleNode = useCallback((id: number) => {
        setOpenMap((prev) => {
            const newMap = new Map(prev);
            const prevValue = prev.get(id) ?? false;
            newMap.set(id, !prevValue);
            return newMap;
        });
    }, []);

    // 전체 펼치기 & 접기 토글
    const toggleAll = (expand: boolean) => {
        const newMap = new Map<number, boolean>();
        nodeMap.forEach((_, key) => {
            newMap.set(key, expand);
        });
        setOpenMap(newMap);
    };

    // 에디터모드 토글
    const handleEditOrSave = () => {
        if (editMode) saveNodes();
        setEditMode(!editMode);
    };

    // drawer 펼치기
    const handleSelectNode = useCallback((node: TopicAll) => {
        setSelectedNodeId(node.id);
        setIsDrawerOpen(true);
    }, []);

    // 검색 - 버튼
    const handleSearch = () => {
        const keyword = searchInput.trim();
        setSearchKeyword(keyword);
        if (!keyword) return;

        const { matchedIds, openParentIds } = findMatchedAndParentIds(nodeMap, keyword);

        const newMap = new Map<number, boolean>();
        openParentIds.forEach((id) => newMap.set(id, true));
        setOpenMap(newMap);
    };

    // 검색 - 키
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 드래그 종료 시 동작
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeNode = nodeMap.get(Number(active.id));
        const overNode = nodeMap.get(Number(over.id));
        if (!activeNode || !overNode || activeNode.parentId !== overNode.parentId) return;

        const parent = nodeMap.get(activeNode.parentId!);
        if (!parent) return;

        // 재정렬
        const siblings = [...parent.children];
        const oldIndex = siblings.findIndex((n) => n.id === activeNode.id);
        const newIndex = siblings.findIndex((n) => n.id === overNode.id);

        siblings.splice(oldIndex, 1);
        siblings.splice(newIndex, 0, activeNode);

        // sortOrder 재부여
        siblings.forEach((n, idx) => (n.sortOrder = idx + 1));
        parent.children = siblings;

        setTreeNodes([...treeNodes]);
        console.log('style length', document.head.querySelectorAll('style').length);
    };

    // 타이틀 수정
    const handleUpdateTitle = useCallback((id: number, newTitle: string) => {
        const node = nodeMap.get(id);
        if (!node) return;
        node.title = newTitle;

        setNodeMap(new Map(nodeMap));
    }, []);

    const handleAddNode = useCallback(
        (id: number) => {
            addNode(id);
        },
        [addNode],
    );

    const handleDeleteNode = useCallback(
        (id: number) => {
            deleteNode(id);
        },
        [deleteNode],
    );

    // ──────────────────────────────────────────────────────────────
    // routing

    // ──────────────────────────────────────────────────────────────
    // submit/api call

    // ──────────────────────────────────────────────────────────────
    //  Render Guards

    // ──────────────────────────────────────────────────────────────
    // jsx

    const documentTree = renderDocument(treeNodes);
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* 검색 영역 */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <TextField
                    label="검색"
                    value={searchInput}
                    size="small"
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={handleSearch} sx={{ p: 0.5 }}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title={isExpanded ? '전체 접기' : '전체 펼치기'}>
                    <IconButton onClick={() => toggleAll(!isExpanded)}>
                        {isExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                    </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <Tooltip title={editMode ? '저장' : '편집'}>
                    <IconButton
                        color={editMode ? 'primary' : 'secondary'}
                        onClick={() => handleEditOrSave()}
                    >
                        {editMode ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                </Tooltip>
            </Stack>
            <Box>
                {editMode ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        {documentTree}
                    </DndContext>
                ) : (
                    documentTree
                )}
            </Box>
            <TreeItemDrawer
                selectedNodeId={selectedNodeId}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
            />
        </Container>
    );
};

export default StudyPage;
