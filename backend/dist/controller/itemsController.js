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
const itemsModel_1 = __importDefault(require("../models/itemsModel"));
const subCategoryModel_1 = __importDefault(require("../models/subCategoryModel"));
const router = express_1.default.Router();
router.post("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, image, description, taxApplicability, tax, baseAmount, discount, subCategoryId, categoryId, } = req.body;
        const totalAmount = baseAmount - discount;
        const newItem = new itemsModel_1.default({
            name,
            image,
            description,
            taxApplicability,
            tax,
            baseAmount,
            discount,
            totalAmount,
            subCategoryId,
            categoryId,
        });
        const savedItem = yield newItem.save();
        yield subCategoryModel_1.default.findByIdAndUpdate(subCategoryId, {
            $push: { items: savedItem._id },
        });
        res.status(201).json(savedItem);
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
// Get All Items
router.get("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield itemsModel_1.default.find();
        res.status(200).json(items);
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
// Get Item by ID
router.get("/items/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield itemsModel_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ error: "Item not found" });
        res.status(200).json(item);
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
// Get All Items for a Category
router.get("/items/category/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield itemsModel_1.default.find({
            categoryId: req.params.categoryId,
        }).populate("categoryId");
        res.status(200).json(items);
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
// Get All Items for a SubCategory
router.get("/items/subcategory/:subCategoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield itemsModel_1.default.find({
            subCategoryId: req.params.subCategoryId,
        }).populate("subCategoryId");
        res.status(200).json(items);
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
// Edit Item
router.put("/items/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, image, description, taxApplicability, tax, baseAmount, discount, subCategoryId, categoryId, } = req.body;
        const totalAmount = baseAmount - discount;
        const updatedItem = yield itemsModel_1.default.findByIdAndUpdate(req.params.id, {
            name,
            image,
            description,
            taxApplicability,
            tax,
            baseAmount,
            discount,
            totalAmount,
            subCategoryId,
            categoryId,
        }, { new: true });
        if (!updatedItem)
            return res.status(404).json({ error: "Item not found" });
        res.status(200).json(updatedItem);
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
// Delete Item
router.delete("/items/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedItem = yield itemsModel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedItem)
            return res.status(404).json({ error: "Item not found" });
        res.status(200).json({ message: "Item deleted", item: deletedItem });
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
// Search Item by Name
router.get("/items/search/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Search endpoint hit");
    try {
        // Retrieve the 'name' URL parameter
        const { name } = req.params;
        console.log("Search term:", name);
        // Perform a case-insensitive search using a regular expression
        const items = yield itemsModel_1.default.find({ name: new RegExp(name, "i") });
        // Return the search results
        res.status(200).json(items);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}));
exports.default = router;
