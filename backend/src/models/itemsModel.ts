import mongoose, { Schema, Document } from 'mongoose';

interface Item extends Document {
  name: string;
  image: string;
  description: string;
  taxApplicability: boolean;
  tax: number;
  baseAmount: number;
  discount: number;
  totalAmount: number;
  subCategoryId?: mongoose.Schema.Types.ObjectId; 
  categoryId?: mongoose.Schema.Types.ObjectId; 
  
}

const itemSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String},
  description: { type: String },
  taxApplicability: { type: Boolean},
  tax: { type: Number, default: 0 },
  baseAmount: { type: Number, required: true },
  discount: { type: Number, default: 0, required: true },
  totalAmount: { type: Number, required: true },
  subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
});

const Item = mongoose.model<Item>('Item', itemSchema);

export default Item;
