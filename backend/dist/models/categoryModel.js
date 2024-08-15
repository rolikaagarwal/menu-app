"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    taxApplicability: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    taxType: { type: String },
    subCategories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'SubCategory' }]
});
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
