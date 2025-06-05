import ErrorLayout from './ErrorLayout';
const UnauthorizedPage = () => (
    <ErrorLayout
        code={401}
        title="인증되지 않은 접근입니다."
        message="로그인이 필요한 서비스입니다. 로그인 후 다시 시도해주세요."
        buttonText="로그인 페이지로 이동"
        redirectPath="/login"
    />
);

export default UnauthorizedPage;
