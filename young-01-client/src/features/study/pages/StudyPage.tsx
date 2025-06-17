import { useState, useEffect, useReducer, useMemo } from 'react';
import {
    Box,
    Container,
    IconButton,
    Divider,
    Drawer,
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

import SortableTreeItem from '../components/SortableTreeItem';
import TreeItemDrawer from '../components/TreeItemDrawer';

import { TopicTree } from '@shared/types/study/study.types';

// util
import { treeReducer, TreeAction } from '../hook/useTreeReducer';
import { findNodeById } from '../util/treeUtils';
import studyService from '../study.service';

const StudyPage = () => {
    // ──────────────────────────────────────────────────────────────
    // constants
    const STORAGE_KEY = 'study-open-map';

    // ──────────────────────────────────────────────────────────────
    // hook form

    // 트리 가져오기
    const { data } = useQuery({
        queryKey: ['study', 'findTree'],
        queryFn: studyService.findTree,
        retry: false,
    });
    // 데이터
    // const [nodes, setNodes] = useState<TopicTree[]>([]);
    const [nodes, dispatch] = useReducer(treeReducer, []);

    // 화면 편집모드
    const [editMode, setEditMode] = useState(false);

    // 펼치기 & 접기
    const [openMap, setOpenMap] = useState<Map<number, boolean>>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return new Map();

            const entries = JSON.parse(raw);
            if (!Array.isArray(entries)) {
                console.warn('openMap 복원 실패: 배열이 아님');
                return new Map();
            }
            return new Map<number, boolean>(entries);
        } catch (err) {
            console.warn('openMap 복원 실패', err);
            return new Map();
        }
    });

    // 선택 시 상세보기
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

    // drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 검색 input value
    const [searchInput, setSearchInput] = useState('');
    // 검색 키워드
    const [searchKeyword, setSearchKeyword] = useState('');

    // selectedNodeId 값에 따른 노드
    const selectedNode = useMemo(() => {
        if (selectedNodeId == null) return null;
        return findNodeById(nodes, selectedNodeId);
    }, [selectedNodeId, nodes]);

    // 노드가 하나라도 열려있는지 여부
    const isExpanded = useMemo(() => {
        return Array.from(openMap.values()).some((v) => v);
    }, [nodes, openMap]);

    // 응답 데이터인 data => nodes에 저장
    useEffect(() => {
        if (data) {
            dispatch({ type: 'SET_TREE', nodes: data });
        }
    }, [data]);

    // 데이터 조회 시 노드 열림상태 반영
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const entries = JSON.parse(raw);
                if (Array.isArray(entries)) {
                    const map = new Map<number, boolean>(entries);
                    setOpenMap(map);
                }
            }
        } catch (err) {
            console.warn('openMap 복원 실패', err);
        }
    }, [nodes]); // nodes 있어야 toggleAll 등 작동함

    // 노드 열림 상태 저장
    useEffect(() => {
        const arr = Array.from(openMap.entries());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }, [openMap]);

    // 검색
    useEffect(() => {
        if (!nodes) return;

        if (searchKeyword.trim() === '') {
            return;
        }

        const matchedIds = findOpenIdsForKeyword(nodes, searchKeyword.trim());
        const newMap = new Map<number, boolean>();
        matchedIds.forEach((id) => newMap.set(id, true));
        setOpenMap(newMap);
    }, [searchKeyword, nodes]);

    // ──────────────────────────────────────────────────────────────
    // Derived Values

    // ──────────────────────────────────────────────────────────────
    // helpers

    const renderDocument = (nodes: TopicTree[]) => {
        const sorted = [...nodes].sort((a, b) => a.sortOrder - b.sortOrder);
        return (
            <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
                {sorted.map((node) => {
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
                            <SortableTreeItem
                                node={node}
                                isOpen={isOpen}
                                editMode={editMode}
                                toggleNode={toggleNode}
                                handleSelectNode={handleSelectNode}
                                searchKeyword={searchKeyword}
                                handleUpdateTitle={handleUpdateTitle}
                            />
                            {hasChildren && isOpen && renderDocument(node.children)}
                        </Box>
                    );
                })}
            </SortableContext>
        );
    };

    const findOpenIdsForKeyword = (nodes: TopicTree[], keyword: string): number[] => {
        const openIds = new Set<number>();

        const walk = (nodeList: TopicTree[], parentChain: number[] = []) => {
            nodeList.forEach((node) => {
                const matched = node.title.includes(keyword);
                if (matched) {
                    parentChain.forEach((id) => openIds.add(id)); // 상위 노드 열기
                    openIds.add(node.id);
                }
                if (node.children?.length) {
                    walk(node.children, [...parentChain, node.id]);
                }
            });
        };

        walk(nodes);
        return Array.from(openIds);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px 이상 움직여야 drag 시작
            },
        }),
    );
    // ──────────────────────────────────────────────────────────────
    // handler

    // 펼치기 & 접기 토글
    const toggleNode = (id: number) => {
        setOpenMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, !prev.get(id));
            return newMap;
        });
    };
    // 전체 펼치기 & 접기 토글
    const toggleAll = (expand: boolean) => {
        const newMap = new Map<number, boolean>();
        const walk = (nodes: TopicTree[]) => {
            nodes.forEach((node) => {
                newMap.set(node.id, expand);
                if (node.children?.length) walk(node.children);
            });
        };
        walk(nodes ?? []);
        setOpenMap(newMap);
    };

    // drawer 펼치기
    const handleSelectNode = (node: TopicTree) => {
        setSelectedNodeId(node.id);
        setIsDrawerOpen(true);
    };

    // 검색 - 버튼
    const handleSearch = () => {
        setSearchKeyword(searchInput.trim());
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

        const swapSortOrder = (nodes: TopicTree[]) => {
            const stack: TopicTree[][] = [nodes];

            while (stack.length > 0) {
                const siblings = stack.pop()!;
                const activeNode = siblings.find((e) => e.id == active.id);
                const overNode = siblings.find((e) => e.id == over.id);

                if (activeNode && overNode) {
                    console.log('activeNode', activeNode);
                    console.log('overNode', overNode);

                    dispatch({
                        type: 'UPDATE_SORT_ORDER',
                        id: activeNode.id,
                        sortOrder: overNode.sortOrder,
                    });

                    dispatch({
                        type: 'UPDATE_SORT_ORDER',
                        id: overNode.id,
                        sortOrder: activeNode.sortOrder,
                    });

                    break;
                }
                // 다음 단계 탐색
                siblings.forEach((n) => n.children && stack.push(n.children));
            }
        };

        swapSortOrder(nodes);
        console.log('style length', document.head.querySelectorAll('style').length);
    };

    // 타이틀 수정
    const handleUpdateTitle = (id: number, newTitle: string) => {
        dispatch({
            type: 'UPDATE_TITLE',
            id: id,
            title: newTitle,
        });
    };
    // 내용 수정
    const handleUpdateContent = (id: number, newContent: string) => {
        dispatch({
            type: 'UPDATE_CONTENT',
            id: id,
            content: newContent,
        });
    };

    // ──────────────────────────────────────────────────────────────
    // routing

    // ──────────────────────────────────────────────────────────────
    // submit/api call

    // ──────────────────────────────────────────────────────────────
    //  Render Guards

    // ──────────────────────────────────────────────────────────────
    // jsx
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* 검색 영역 */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <TextField
                    label="검색"
                    value={searchInput}
                    size="small"
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon sx={{ cursor: 'pointer' }} onClick={handleSearch} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
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
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                </Tooltip>
            </Stack>
            <Box>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {renderDocument(nodes ?? [])}
                </DndContext>
            </Box>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ sx: { width: 360 } }}
            >
                <TreeItemDrawer
                    selectedNode={selectedNode}
                    handleUpdateTitle={handleUpdateTitle}
                    handleUpdateContent={handleUpdateContent}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
            </Drawer>
        </Container>
    );
};

export default StudyPage;
