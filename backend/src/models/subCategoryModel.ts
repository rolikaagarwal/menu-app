import mongoose, { Schema, Document } from 'mongoose';

interface ISubCategory extends Document {
  name: string;
  image: string;
  description: string;
  taxApplicability: boolean;
  tax?: number;
  taxType?: string;
  categoryId: mongoose.Schema.Types.ObjectId; 
  items: mongoose.Schema.Types.ObjectId[];
}

const SubCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number },
  taxType: { type: String },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});

const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);
export default SubCategory;
