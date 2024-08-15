import { Router, Request, Response } from 'express';
import { Category } from '../models/categoryModel';

const router = Router();

router.post('/categories', async (req: Request, res: Response) => {
  try {
    console.log("testing")
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    const newCategory = new Category({
      name,
      image,
      description,
      taxApplicability,
      tax,
      taxType
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});


router.get('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      $or: [{ _id: id }, { name: id }]
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});


router.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image, description, taxApplicability, tax, taxType },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(updatedCategory);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});


router.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category deleted', category: deletedCategory });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;
