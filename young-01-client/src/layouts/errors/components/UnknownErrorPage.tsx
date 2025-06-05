import ErrorLayout from './ErrorLayout';

const UnknownErrorPage = () => (
    <ErrorLayout code={520} title="알 수 없는 오류" message="예기치 못한 문제가 발생했습니다." />
);

export default UnknownErrorPage;
