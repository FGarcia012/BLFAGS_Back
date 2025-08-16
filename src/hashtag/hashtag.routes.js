import { Router } from "express";
import {
    getHashtags,
    getHashtag,
    addHashtag,
    deleteHashtag
} from './hashtag.controller.js';
import {
    addHashtagValidator,
    deleteHashtagValidator
} from '../middlewares/hashtag-validator.js';

const router = Router();

router.get('/getHashtags', getHashtags);

router.get('/getHashtag/:hid', getHashtag);

router.post('/addHashtag', addHashtagValidator, addHashtag);

router.delete('/deleteHashtag/:hid', deleteHashtagValidator, deleteHashtag);

export default router;
