import { loadState, saveState } from "../../utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const getCategories = () => {
  return loadState("categories") || [];
};

const addCategory = (categoryData) => {
  const categories = loadState("categories") || [];
  const newCategory = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...categoryData,
  };
  categories.push(newCategory);
  saveState("categories", categories);
  return newCategory;
};

const updateCategory = (data) => {
  const categories = loadState("categories") || [];
  const updated = categories.map((cat) =>
    cat.id === data.id ? { ...cat, ...data } : cat
  );
  saveState("categories", updated);
  return updated;
};

const deleteCategory = (id) => {
  const categories = loadState("categories") || [];
  const updated = categories.filter((cat) => cat.id !== id);
  saveState("categories", updated);
  return updated;
};

export default { getCategories, addCategory, updateCategory, deleteCategory };