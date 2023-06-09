"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCatById = exports.removeCatById = exports.findUserCatById = exports.postedCat = exports.findUserCats = exports.removeUser = exports.findUsersByUsername = exports.insertUser = exports.findUsers = void 0;
const mongodb_1 = require("mongodb");
const connection_1 = require("../db/connection");
const collection = connection_1.db.collection("users");
const findUsers = () => {
    return collection.find({}).toArray();
};
exports.findUsers = findUsers;
const insertUser = (user) => {
    user.cats = [];
    return collection.insertOne(user).then((data) => {
        return collection.findOne({ _id: new mongodb_1.ObjectId(data.insertedId) });
    });
};
exports.insertUser = insertUser;
const findUsersByUsername = (username) => {
    return collection.findOne({ username: username }).then((users) => {
        if (users === null) {
            return Promise.reject({ msg: "Username doesn't exist", status: 404 });
        }
        else {
            return users;
        }
    });
};
exports.findUsersByUsername = findUsersByUsername;
const removeUser = (username) => {
    return collection.deleteOne({ username: username }).then((users) => {
        if (users.deletedCount === 0) {
            return Promise.reject({ msg: "Username doesn't exist", status: 404 });
        }
        else {
            return users;
        }
    });
};
exports.removeUser = removeUser;
const findUserCats = (username) => {
    const filter = {
        username: username,
    };
    const projection = {
        cats: 1,
    };
    return collection.findOne(filter, { projection }).then((data) => {
        if (!data) {
            return Promise.reject({ status: 400, msg: "Username does not exist" });
        }
        return data.cats;
    });
};
exports.findUserCats = findUserCats;
const postedCat = (newCat, username) => {
    return (0, exports.findUserCats)(username)
        .then((allCats) => {
        let highestCatId = 0;
        for (const cat of allCats) {
            if (cat.cat_id > highestCatId) {
                highestCatId = cat.cat_id;
            }
        }
        const newCatId = highestCatId + 1;
        newCat.cat_id = newCatId;
    })
        .then(() => {
        return collection.findOneAndUpdate({ username: username }, { $push: { cats: newCat } }, { returnDocument: "after" });
    })
        .then(({ value }) => { return value.cats[value.cats.length - 1]; });
};
exports.postedCat = postedCat;
const findUserCatById = (username, cat_id) => {
    const filter = {
        'username': username
    };
    const projection = {
        'cats': { '$elemMatch': { 'cat_id': cat_id } }
    };
    if (isNaN(cat_id))
        return Promise.reject({ status: 400, msg: "Invalid cat_id" });
    return collection.findOne(filter, { projection })
        .then(data => {
        if (!data) {
            return Promise.reject({ status: 404, msg: "Username does not exist" });
        }
        if (!data.cats) {
            return Promise.reject({ status: 404, msg: "Cat does not exist" });
        }
        return data.cats[0];
    });
};
exports.findUserCatById = findUserCatById;
const removeCatById = (username, id) => {
    if (isNaN(id))
        return Promise.reject({ status: 400, msg: 'Invalid cat_id' });
    return collection.updateOne({ username: username }, { $pull: { cats: { cat_id: { '$eq': id } } } })
        .then(data => {
        if (!data.modifiedCount)
            return Promise.reject({ status: 404, msg: 'Cat not found' });
    });
};
exports.removeCatById = removeCatById;
const updateCatById = (username, cat_id, missing) => {
    const query = { username: username, 'cats.cat_id': cat_id };
    const updateDocument = {
        $set: { "cats.$.missing": missing }
    };
    if (isNaN(cat_id))
        return Promise.reject({ status: 400, msg: "Invalid cat_id" });
    return collection.findOneAndUpdate(query, updateDocument, { returnDocument: 'after' })
        .then(({ value }) => {
        if (!value) {
            return Promise.reject({ status: 404, msg: "Cat does not exist" });
        }
        return value.cats.filter((cat) => cat.cat_id === cat_id)[0];
    });
};
exports.updateCatById = updateCatById;
