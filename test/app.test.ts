import request from "supertest";
import app from "../app";
import { describe, after } from "mocha";
import assert from "assert";
import { connection, db } from "../db/connection";
import chai from "chai";
import { ObjectId } from "mongodb";
const should = chai.should();
const expect = chai.expect;

after(() => connection.close());

describe("Unavailable Endpoint", () => {
    it("404: returns a status 404 and nothing else", () => {
        return request(app)
            .get("/api/not_an_endpoint")
            .then((res) => assert.equal(res.status, 404));
    });
});

describe("GET /api/users", () => {
    it("200: returns an array of all users", () => {
        return request(app)
            .get("/api/users")
            .then((res) => {
                assert.equal(res.status, 200);
                const { users } = res.body;
                assert.equal(users.length > 0, true);
                users.forEach((user: any) => {
                    should.exist(user);
                    user.should.be.an("object");
                    user.should.have.keys("_id", "avatar", "description", "username", "cats");
                });
            });
    });
});

describe("GET /api/posts", () => {
    it("200: returns an array of all posts", () => {
        return request(app)
            .get("/api/posts")
            .then((res) => {
                assert.equal(res.status, 200);
                const { posts } = res.body;
                assert.equal(posts.length > 0, true);
                posts.forEach((post: any) => {
                    should.exist(post);
                    post.should.be.an("object");
                    post.should.have.keys(
                        "_id",
                        "img_url",
                        "posted_at",
                        "location",
                        "votes",
                        "username",
                        "description",
                        "lat",
                        "long"
                    );
                });
            });
    });
});

describe("POST /api/users", () => {
    it("201: inserts a user into the database and returns the new user", () => {
        const testUser = {
            username: "Steve1",
            description: "Super cool cat lover",
            avatar: "https://i.pinimg.com/736x/a7/9a/f3/a79af309957138af9ef7696b261b71fe.jp…",
        };
        return request(app)
            .post("/api/users")
            .send(testUser)
            .then((res) => {
                assert.equal(res.status, 201);
                const { user } = res.body;
                should.exist(user);
                user.should.be.an("object");
                user.should.have.keys("_id", "cats", "avatar", "description", "username");
            });
    });
    it("400: returns a bad request if data format is wrong", () => {
        const testUser = {
            description: "Super cool cat lover",
            avatar: "https://i.pinimg.com/736x/a7/9a/f3/a79af309957138af9ef7696b261b71fe.jp…",
        };
        return request(app)
            .post("/api/users")
            .send(testUser)
            .then((res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.msg, "Invalid format");
            });
    });
    it("400: returns a bad request if username already exists", () => {
        const testUser = {
            username: "Steve1",
            description: "Super cool cat lover",
            avatar: "https://i.pinimg.com/736x/a7/9a/f3/a79af309957138af9ef7696b261b71fe.jp…",
        };
        return request(app)
            .post("/api/users")
            .send(testUser)
            .then((res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.msg, "Username already exists");
            });
    });
});

describe("POSTS /api/posts", () => {
    it("201: inserts a post into the database and returns the new post", () => {
        const newPost = {
            img_url: "https://i.ytimg.com/vi/da1E9rVKPMA/maxresdefault.jpg",
            location: "London, UK",
            username: "Ellie123",
            description: "Is this a cat?",
            lat: 51.5072,
            long: 0.1276,
        };
        return request(app)
            .post("/api/posts")
            .send(newPost)
            .then((res) => {
                assert.equal(res.status, 201);
                const { post } = res.body;
                should.exist(post);
                post.should.be.an("object");
                post.should.have.keys(
                    "_id",
                    "img_url",
                    "location",
                    "username",
                    "description",
                    "lat",
                    "long",
                    "votes",
                    "posted_at"
                );
            });
    });
    it("400: returns a bad request if data format is wrong", () => {
        const newPost = {
            location: "London, UK",
            username: "Ellie123",
            description: "Is this a cat?",
            lat: 51.5072,
            long: 0.1276,
        };
        return request(app)
            .post("/api/posts")
            .send(newPost)
            .then((res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.msg, "Invalid format");
            });
    });
    it("400: returns a bad request if the username does not exist", () => {
        const newPost = {
            img_url: "https://i.ytimg.com/vi/da1E9rVKPMA/maxresdefault.jpg",
            location: "London, UK",
            username: "Not_a_User",
            description: "Is this a cat?",
            lat: 51.5072,
            long: 0.1276,
        };
        return request(app)
            .post("/api/posts")
            .send(newPost)
            .then((res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.msg, "Username does not exist");
            });
    });
});

describe("GET /api/posts/:post_id", () => {
    it("200: returns post by post_id", () => {
        return db
            .collection("posts")
            .findOne()
            .then((data) => {
                return request(app)
                    .get(`/api/posts/${data!._id}`)
                    .then((res) => {
                        assert.equal(res.status, 200);
                        const { post } = res.body;
                        should.exist(post);
                        post.should.be.an("object");
                        post.should.have.keys(
                            "_id",
                            "img_url",
                            "location",
                            "username",
                            "description",
                            "lat",
                            "long",
                            "votes",
                            "posted_at"
                        );
                        assert.equal(post._id, data!._id);
                    });
            });
    });
    it("400: returns bad request if the post_id is invalid", () => {
        return request(app)
            .get(`/api/posts/not_a_post`)
            .then((res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.msg, "Invalid id");
            });
    });
    it("400: returns bad request if the post_id does not exist", () => {
        return request(app)
            .get(`/api/posts/${new ObjectId()}`)
            .then((res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.msg, "Post does not exist");
            });
    });
});

describe("GET /api/users/:username", () => {
    it("200: returns a user by username", () => {
        return request(app)
            .get("/api/users/Scott687")
            .then((res) => {
                assert.equal(res.status, 200);
                const { users } = res.body;
                should.exist(users);
                users.should.be.an("object");
                users.should.have.keys("_id", "avatar", "description", "username", "cats");
                expect(users.username).to.equal("Scott687");
                expect(users.avatar).to.equal(
                    "https://i2-prod.dailystar.co.uk/incoming/article20472638.ece/ALTERNATES/s1227b/httpscdnimagesdailystarcoukdynamic122photos791000900x738434791"
                );
            });
    });
    it("404: returns a status 404 and a message of username doesnt exist", () => {
        return request(app)
            .get("/api/users/not_a_username")
            .then((res) => {
                assert.equal(res.status, 404), assert.equal(res.body.msg, "Username doesn't exist");
            });
    });
});

describe.only("DELETE /api/users/:username", () => {
    it("204: Deletes a user by their username", () => {
        return request(app)
        .delete("/api/users/Harry111")
        .expect(204)
    })
    it("404: username not found", () => {
        return request(app)
        .delete("/api/users/iamadog")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).to.equal("Username doesn't exist")
        })
    })
})