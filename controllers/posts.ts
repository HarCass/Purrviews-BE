import { findPosts, insertPost, checkUsernameExists, findPostById, deletePost, updatePostById } from "../models/posts"
import { RequestHandler } from "express";

export const getPosts: RequestHandler = (req, res, next) => {
    return findPosts()
    .then(posts => res.status(200).send({posts}));
}

export const postPost: RequestHandler = (req, res, next) => {
    const data = req.body;
    return checkUsernameExists(data.username)
    .then(() => insertPost(data))
    .then(post => res.status(201).send({post}))
    .catch(next);
}

export const getPostById: RequestHandler = (req, res, next) => {
    const {post_id} = req.params;
    return findPostById(post_id)
    .then(post => res.status(200).send({post}))
    .catch(next);
}

export const deletePostById: RequestHandler = (req, res, next) => {
        const { post_id } = req.params;
        return deletePost(post_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next)
    };
    
export const patchPostById: RequestHandler = (req, res, next) => {
    const {post_id} = req.params;
    const {inc_votes} = req.body;
    return updatePostById(post_id, inc_votes)
    .then(post => res.status(200).send({post}))
    .catch(next);
}