import studyRepo from './study.repository';

const studyService = {
    findTree: () => studyRepo.findTree(),
    findNode: (id: number) => studyRepo.findNode(id),
};

export default studyService;
