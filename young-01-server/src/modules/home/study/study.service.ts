import studyRepo from './study.repository';

const studyService = {
    findTree: () => studyRepo.findTree(),
};

export default studyService;
