import { useEffect, useState, Dispatch, SetStateAction } from 'react';

const STORAGE_KEY = 'study-open-map';

export default function useTreeOpenState(): [
    Map<number, boolean>,
    Dispatch<SetStateAction<Map<number, boolean>>>,
] {
    const [openMap, setOpenMap] = useState<Map<number, boolean>>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return new Map();
            const entries = JSON.parse(raw);
            if (Array.isArray(entries)) return new Map<number, boolean>(entries);
        } catch (err) {
            console.warn('openMap 복원 실패', err);
        }
        return new Map();
    });

    useEffect(() => {
        const arr = Array.from(openMap.entries());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }, [openMap]);

    return [openMap, setOpenMap];
}
