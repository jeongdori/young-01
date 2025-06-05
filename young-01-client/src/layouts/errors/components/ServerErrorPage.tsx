import ErrorLayout from './ErrorLayout';
const ServerErrorPage = () => (
    <ErrorLayout
        code={500}
        title="서버 오류가 발생했습니다."
        message="잠시 후 다시 시도해주세요."
    />
);

export default ServerErrorPage;
