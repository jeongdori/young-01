import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * meta: 인터셉터나 로그/알림 분기용 커스텀 필드.
         *   - alert?: boolean  → 인터셉터가 alert() 띄우길 원하지 않으면 false.
         *   - log?: boolean    → 인터셉터가 개발환경에서 console.log/console.warn/console.error 찍길 원하지 않으면 false.
         */
        meta?: {
            alert?: boolean;
            redirectError?: boolean;
            log?: boolean;
        };
    }
}

export {};
