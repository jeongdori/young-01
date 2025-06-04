import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * meta: 인터셉터나 로그/알림 분기용 커스텀 필드.
         *   - alert?: boolean  → 인터셉터가 alert(Toast) 띄우길 원하지 않으면 false.
         *   - log?: boolean    → 인터셉터가 console.log/console.warn/console.error 찍길 원하지 않으면 false.
         */
        meta?: {
            alert?: boolean;
            log?: boolean;
        };

        /** 토큰 재발급 재시도 여부를 붙여두는 용도 (_retry) */
        _retry?: boolean;
    }
}

export {};
