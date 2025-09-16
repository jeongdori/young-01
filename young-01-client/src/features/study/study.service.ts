import axios from '@/api/axios';

import { Topic, TopicAll, InsertTopic } from '@shared/types/study/study.types';

const defaultPath = '/study';
const studyService = {
    findTree: (): Promise<TopicAll[]> => axios.get(`${defaultPath}/`),
    findNode: (id: number): Promise<Topic> => axios.get(`${defaultPath}/${id}`),
    insertNode: (parentId: number, topic: InsertTopic[]): Promise<number> =>
        axios.put(`${defaultPath}/${parentId}`, topic),
    updateNode: (id: number, topic: Topic[]): Promise<number> =>
        axios.put(`${defaultPath}/${id}`, topic),
};
export default studyService;
