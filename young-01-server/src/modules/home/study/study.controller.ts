import { Request, Response } from 'express';
import { resSuccess, resError, resCustom } from '@/utils/response';

import studyService from './study.service';

export const findTree = async (req: Request, res: Response) => {
    try {
        const tree = await studyService.findTree();
        resSuccess(res, tree);
    } catch (err) {
        resError(res, err);
    }
};
