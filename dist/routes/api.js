"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const posts_1 = __importDefault(require("./posts"));
const apiRouter = express_1.default.Router();
apiRouter.use('/users', users_1.default);
apiRouter.use('/posts', posts_1.default);
exports.default = apiRouter;
