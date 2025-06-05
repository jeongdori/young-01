import ErrorLayout from './ErrorLayout';
const ForbiddenPage = () => (
    <ErrorLayout
        code={403}
        title="접근 권한이 없습니다."
        message="이 페이지를 볼 수 있는 권한이 없습니다."
    />
);

export default ForbiddenPage;
