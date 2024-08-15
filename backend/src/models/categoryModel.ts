import mongoose, { Schema, model, Document } from 'mongoose';

interface ICategory extends Document {
    name: string;
    image?: string;
    description?: string;
    taxApplicability: boolean;
    tax?: number;
    taxType?: string;
    subCategories: mongoose.Schema.Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    taxApplicability: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    taxType: { type: String },
    subCategories: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }] 
});

export const Category = model<ICategory>('Category', categorySchema);
