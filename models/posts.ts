import { db } from '../db/connection';
import { ObjectId } from 'mongodb';

const collection = db.collection('posts');

interface postType {
    img_url: string,
    location: string,
    username: string,
    description: string,
    lat: number,
    long: number
    votes: number,
    posted_at: string
}

export const findPosts = () => {
    return collection.find({}).toArray();
}

export const insertPost = (post: postType) => {
    post.votes = 0;
    post.posted_at = new Date().toISOString();
    return collection.insertOne(post)
    .then((data ) => collection.findOne({_id: new ObjectId(data.insertedId)}));
}

export const checkUsernameExists = (username: string) => {
    const userCollection = db.collection('users');
    return userCollection.findOne({username})
    .then(data => {
        if(!data) return Promise.reject({status: 404, msg: 'Username does not exist'});
    });
}

export const findPostById = (id: string) => {
    if (!ObjectId.isValid(id)) {
        return Promise.reject({status: 400, msg: "Invalid id"})
    }
    return collection.findOne({_id: new ObjectId(id)})
    .then(data => {
        if (!data) {
            return Promise.reject({status: 400, msg: "Post does not exist"})
        }
        return data;
    })
}

export const deletePost = (post: string) => {
    const isValidId = ObjectId.isValid(post)
    if(isValidId === false){
         return Promise.reject({ msg: "Invalid Post Id", status: 400 })
    }
    return collection.deleteOne({ _id: new ObjectId(post) }).then((post) => {
        if (post.deletedCount === 0) {
            return Promise.reject({ msg: "Post doesn't exist", status: 404 });
        } else {
            return post;
        }
    })
};

export const updatePostById = (id: string, incVotes: number) => {
     if (!ObjectId.isValid(id)) return Promise.reject({status: 400, msg:"Invalid id"});
     return collection.findOneAndUpdate({_id: new ObjectId(id)}, {$inc: {'votes': incVotes}}, {returnDocument : 'after'})
     .then(({value}) => {
       if (!value) return Promise.reject({status:400, msg: 'Post does not exist'})
        return value;
 })
};