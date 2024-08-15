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
const express_1 = require("express");
const categoryModel_1 = require("../models/categoryModel");
const router = (0, express_1.Router)();
router.post('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("testing");
        const { name, image, description, taxApplicability, tax, taxType } = req.body;
        const newCategory = new categoryModel_1.Category({
            name,
            image,
            description,
            taxApplicability,
            tax,
            taxType
        });
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
}));
router.get('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModel_1.Category.find();
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
}));
router.get('/categories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield categoryModel_1.Category.findOne({
            $or: [{ _id: id }, { name: id }]
        });
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
}));
router.put('/categories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, image, description, taxApplicability, tax, taxType } = req.body;
        const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(id, { name, image, description, taxApplicability, tax, taxType }, { new: true });
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
}));
router.delete('/categories/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCategory = yield categoryModel_1.Category.findByIdAndDelete(id);
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
}));
exports.default = router;
