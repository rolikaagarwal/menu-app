"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subCategoryModel_1 = __importDefault(require("../models/subCategoryModel"));
const categoryModel_1 = require("../models/categoryModel");
const router = express_1.default.Router();
router.post("/subcategories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, image, description, taxApplicability, tax, taxType, categoryId, } = req.body;
        const newSubCategory = new subCategoryModel_1.default({
            name,
            image,
            description,
            taxApplicability,
            tax,
            taxType,
            categoryId,
        });
        // Save the new subcategory to the database
        const savedSubCategory = yield newSubCategory.save();
        if (!savedSubCategory) {
            throw new Error("SubCategory could not be created");
        }
        // Update the corresponding category to include the new subcategory ID
        const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(categoryId, { $push: { subCategories: savedSubCategory._id } }, { new: true } // Return the updated document
        );
        if (!updatedCategory) {
            throw new Error("Category could not be updated with the new subcategory");
        }
        // Respond with the saved subcategory
        res.status(201).json(savedSubCategory);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
}));
// Get All SubCategories
router.get("/subcategories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCategories = yield subCategoryModel_1.default.find();
        res.status(200).json(subCategories);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
}));
// Get SubCategory by ID
router.get("/subcategories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCategory = yield subCategoryModel_1.default.findById(req.params.id);
        if (!subCategory)
            return res.status(404).json({ error: "SubCategory not found" });
        res.status(200).json(subCategory);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
}));
// Get All SubCategories for a Category
router.get("/subcategories/category/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subCategories = yield subCategoryModel_1.default.find({
            categoryId: req.params.categoryId,
        });
        res.status(200).json(subCategories);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
}));
// Edit SubCategory
router.put("/subcategories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSubCategory = yield subCategoryModel_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubCategory)
            return res.status(404).json({ error: "SubCategory not found" });
        res.status(200).json(updatedSubCategory);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
}));
// Delete SubCategory
router.delete("/subcategories/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSubCategory = yield subCategoryModel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedSubCategory)
            return res.status(404).json({ error: "SubCategory not found" });
        res
            .status(200)
            .json({
            message: "SubCategory deleted",
            subCategory: deletedSubCategory,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
}));
exports.default = router;
