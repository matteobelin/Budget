import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName : { type: String, required: true },
  color:  { type: String, required: true },
  customerId : { type: String, required: true}
});

const Category = mongoose.model('Category', categorySchema);

export default Category;