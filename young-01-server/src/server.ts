import app from './app';
import logger from '@/lib/logger';

const port = process.env.PORT || 3000;

app.listen(port, () => {
    logger.info(`서버 실행: http://localhost:${port}`);
});
