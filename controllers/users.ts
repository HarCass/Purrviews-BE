import { findUsers, insertUser, findUsersByUsername, removeUser, findUserCats, findUserCatById } from "../models/users";
import { RequestHandler } from "express";

export const getUsers: RequestHandler = (req, res, next) => {
    return findUsers().then((users) => res.status(200).send({ users }));
};

export const postUser: RequestHandler = (req, res, next) => {
    const data = req.body;
    return insertUser(data)
        .then((user) => res.status(201).send({ user }))
        .catch(next);
};

export const getUserByUsername = (req: any, res: any, next: any) => {
    const { username } = req.params;
    return findUsersByUsername(username)
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch(next);
};

export const deleteUser = (req: any, res: any, next: any) => {
    const { username } = req.params;
    return removeUser(username)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
};

export const getUserCats: RequestHandler = (req, res, next) => {
    const { username } = req.params;
    return findUserCats(username)
        .then((cats) => res.status(200).send({ cats }))
        .catch(next);
};


export const getCatById: RequestHandler = (req, res, next) => {
    const {username, cat_id} = req.params;
    return findUserCatById(username, Number(cat_id))
    .then(cat => res.status(200).send({cat}))
    .catch(next);
}