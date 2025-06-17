import axios from '@/api/axios';

import { TopicTree } from '@shared/types/study/study.types';

const defaultPath = '/study';
const studyService = {
    findTree: (): Promise<TopicTree[]> => axios.get(`${defaultPath}/`),
};
export default studyService;
