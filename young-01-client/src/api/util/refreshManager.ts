import axios from 'axios';
import useAuthStore from '@/stores/auth/authStore';

type QueueCallback = () => void;

class RefreshManager {
    private refreshing = false;
    private queue: QueueCallback[] = [];

    private refreshInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
        withCredentials: true,
        timeout: 10000,
    });

    public async ensureToken() {
        if (this.refreshing) {
            // Refresh 중이면 queue에 대기
            await new Promise<void>((resolve) => this.queue.push(resolve));
            return;
        }

        // 토큰 만료 여부는 상황에 따라 로직 추가 가능 (ex. localStorage token expiry check)
        this.refreshing = true;

        try {
            await this.refreshInstance.post('/refresh');
        } catch (e) {
            useAuthStore.getState().logout();
            const currentPath = window.location.pathname + window.location.search;
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            throw e;
        } finally {
            this.refreshing = false;
            this.queue.forEach((cb) => cb());
            this.queue = [];
        }
    }

    public logout() {
        useAuthStore.getState().logout();
        const currentPath = window.location.pathname + window.location.search;
        alert('권한이 없거나 로그인 정보가 유효하지 않습니다. 로그인 후 다시 시도해주세요.');
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
}

export const refreshManager = new RefreshManager();
