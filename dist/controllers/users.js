"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUserCats = exports.patchCatById = exports.deleteCatById = exports.getCatById = exports.getUserCats = exports.deleteUser = exports.getUserByUsername = exports.postUser = exports.getUsers = void 0;
const users_1 = require("../models/users");
const posts_1 = require("../models/posts");
const getUsers = (req, res, next) => {
    return (0, users_1.findUsers)().then((users) => res.status(200).send({ users }));
};
exports.getUsers = getUsers;
const postUser = (req, res, next) => {
    const data = req.body;
    return (0, users_1.insertUser)(data)
        .then((user) => res.status(201).send({ user }))
        .catch(next);
};
exports.postUser = postUser;
const getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    return (0, users_1.findUsersByUsername)(username)
        .then((users) => {
        res.status(200).send({ users });
    })
        .catch(next);
};
exports.getUserByUsername = getUserByUsername;
const deleteUser = (req, res, next) => {
    const { username } = req.params;
    return (0, users_1.removeUser)(username)
        .then(() => {
        res.sendStatus(204);
    })
        .catch(next);
};
exports.deleteUser = deleteUser;
const getUserCats = (req, res, next) => {
    const { username } = req.params;
    return (0, users_1.findUserCats)(username)
        .then((cats) => res.status(200).send({ cats }))
        .catch(next);
};
exports.getUserCats = getUserCats;
const getCatById = (req, res, next) => {
    const { username, cat_id } = req.params;
    return (0, users_1.findUserCatById)(username, Number(cat_id))
        .then(cat => res.status(200).send({ cat }))
        .catch(next);
};
exports.getCatById = getCatById;
const deleteCatById = (req, res, next) => {
    const { username, cat_id } = req.params;
    return (0, posts_1.checkUsernameExists)(username)
        .then(() => (0, users_1.removeCatById)(username, Number(cat_id)))
        .then(() => res.sendStatus(204))
        .catch(next);
};
exports.deleteCatById = deleteCatById;
const patchCatById = (req, res, next) => {
    const { username, cat_id } = req.params;
    const { missing } = req.body;
    return (0, posts_1.checkUsernameExists)(username)
        .then(() => (0, users_1.updateCatById)(username, Number(cat_id), missing))
        .then(cat => res.status(200).send({ cat }))
        .catch(next);
};
exports.patchCatById = patchCatById;
const postUserCats = (req, res, next) => {
    const { username } = req.params;
    const data = req.body;
    return (0, users_1.postedCat)(data, username)
        .then((cat) => res.status(201).send({ cat }))
        .catch(next);
};
exports.postUserCats = postUserCats;
