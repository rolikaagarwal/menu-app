import express, { Request, Response } from "express";
import SubCategory from "../models/subCategoryModel";
import { Category } from "../models/categoryModel";

const router = express.Router();

router.post("/subcategories", async (req: Request, res: Response) => {
  try {
    const {
      name,
      image,
      description,
      taxApplicability,
      tax,
      taxType,
      categoryId,
    } = req.body;

    const newSubCategory = new SubCategory({
      name,
      image,
      description,
      taxApplicability,
      tax,
      taxType,
      categoryId,
    });
    const savedSubCategory = await newSubCategory.save();

    if (!savedSubCategory) {
      throw new Error("SubCategory could not be created");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $push: { subCategories: savedSubCategory._id } },
      { new: true }
    );

    if (!updatedCategory) {
      throw new Error("Category could not be updated with the new subcategory");
    }

    res.status(201).json(savedSubCategory);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});


// Get All SubCategories
router.get("/subcategories", async (req: Request, res: Response) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json(subCategories);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Get SubCategory by ID
router.get("/subcategories/:id", async (req: Request, res: Response) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json(subCategory);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Get All SubCategories for a Category
router.get(
  "/subcategories/category/:categoryId",
  async (req: Request, res: Response) => {
    try {
      const subCategories = await SubCategory.find({
        categoryId: req.params.categoryId,
      });
      res.status(200).json(subCategories);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }
);

// Edit SubCategory
router.put("/subcategories/:id", async (req: Request, res: Response) => {
  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSubCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json(updatedSubCategory);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Delete SubCategory
router.delete("/subcategories/:id", async (req: Request, res: Response) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res
      .status(200)
      .json({
        message: "SubCategory deleted",
        subCategory: deletedSubCategory,
      });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;
