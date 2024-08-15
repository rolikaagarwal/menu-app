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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = require("../models/category.model");
// Create a new category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const newCategory = new category_model_1.Category({ name, description });
        yield newCategory.save();
        res.status(201).json(newCategory);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});
exports.createCategory = createCategory;
// Get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.Category.find();
        res.status(200).json(categories);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});
exports.getCategories = getCategories;
// Get a single category by ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findById(req.params.id);
        if (!category)
            return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(category);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});
exports.getCategoryById = getCategoryById;
// Update a category by ID
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCategory = yield category_model_1.Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory)
            return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});
exports.updateCategory = updateCategory;
// Delete a category by ID
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCategory = yield category_model_1.Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory)
            return res.status(404).json({ error: 'Category not found' });
        res.status(200).json({ message: 'Category deleted', category: deletedCategory });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});
exports.deleteCategory = deleteCategory;
