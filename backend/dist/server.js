"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const categoryController_1 = __importDefault(require("./controller/categoryController"));
const subCategoryController_1 = __importDefault(require("./controller/subCategoryController"));
const itemsController_1 = __importDefault(require("./controller/itemsController"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const source = process.env.MONGO_URI || "";
const allowedOrigins = ['http://localhost:3000'];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin || "") !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(body_parser_1.default.json());
mongoose_1.default.connect(source)
    .then(() => {
    console.log('DB connected');
})
    .catch((err) => {
    console.error('Error connecting to DB:', err);
});
app.use('/api', categoryController_1.default);
app.use('/api', subCategoryController_1.default);
app.use('/api', itemsController_1.default);
app.get('/', (req, res) => {
    res.send('Hello, welcome to hotel menu');
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
