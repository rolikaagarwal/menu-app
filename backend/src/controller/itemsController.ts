import express, { Request, Response } from "express";
import Item from "../models/itemsModel";
import SubCategory from "../models/subCategoryModel";
import { Category } from "../models/categoryModel";

const router = express.Router();

router.post("/items", async (req: Request, res: Response) => {
  try {
    const {
      name,
      image,
      description,
      taxApplicability,
      tax,
      baseAmount,
      discount,
      subCategoryId,
      categoryId,
    } = req.body;

    const totalAmount = baseAmount - discount;

    const newItem = new Item({
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

    const savedItem = await newItem.save();

    await SubCategory.findByIdAndUpdate(subCategoryId, {
      $push: { items: savedItem._id },
    });

    res.status(201).json(savedItem);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Get All Items
router.get("/items", async (req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Get Item by ID
router.get("/items/:id", async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(item);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Get All Items for a Category
router.get(
  "/items/category/:categoryId",
  async (req: Request, res: Response) => {
    try {
      const items = await Item.find({
        categoryId: req.params.categoryId,
      }).populate("categoryId");
      res.status(200).json(items);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }
);

// Get All Items for a SubCategory
router.get(
  "/items/subcategory/:subCategoryId",
  async (req: Request, res: Response) => {
    try {
      const items = await Item.find({
        subCategoryId: req.params.subCategoryId,
      }).populate("subCategoryId");
      res.status(200).json(items);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }
);

// Edit Item
router.put("/items/:id", async (req: Request, res: Response) => {
  try {
    const {
      name,
      image,
      description,
      taxApplicability,
      tax,
      baseAmount,
      discount,
      subCategoryId,
      categoryId,
    } = req.body;
    const totalAmount = baseAmount - discount;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(updatedItem);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Delete Item
router.delete("/items/:id", async (req: Request, res: Response) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.status(200).json({ message: "Item deleted", item: deletedItem });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Search Item by Name
router.get("/items/search/:name", async (req: Request, res: Response) => {
  console.log("Search endpoint hit");
  try {
    const { name } = req.params;
    console.log("Search term:", name);

    const items = await Item.find({ name: new RegExp(name, "i") });

    res.status(200).json(items);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;
