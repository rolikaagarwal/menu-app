import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Modal from "react-modal";
import { BASE_URL } from "../constants";

interface Category {
  _id: string;
  name: string;
  subCategories: string[];
}

interface SubCategory {
  _id: string;
  name: string;
  items: string[];
}

interface Item {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  taxApplicability?: boolean;
  tax?: number;
  baseAmount: number;
  discount: number;
  totalAmount: number;
  subCategoryId: string;
  categoryId: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState<{
    [key: string]: SubCategory;
  }>({});
  const [itemDetails, setItemDetails] = useState<{ [key: string]: Item }>({});
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubCategory, setCurrentSubCategory] =
    useState<SubCategory | null>(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newSubCategoryName, setNewSubCategoryName] = useState<string>("");
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemImage, setNewItemImage] = useState<string>("");
  const [newItemDescription, setNewItemDescription] = useState<string>("");
  // const [newItemTaxApplicability, setNewItemTaxApplicability] =
  //   useState<boolean>(false);
  const [newItemTax, setNewItemTax] = useState<number>(0);
  const [newItemBaseAmount, setNewItemBaseAmount] = useState<number>(0);
  const [newItemDiscount, setNewItemDiscount] = useState<number>(0);
  // const [newItemTotalAmount, setNewItemTotalAmount] = useState<number>(0);
  const [updatedSubCategoryName, setUpdatedSubCategoryName] = useState<string>("");
  // const [updatedItemName, setUpdatedItemName] = useState<string>("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error("Data format is incorrect");
        }
      })
      .catch((error) => setError("Error fetching data: " + error.message));
  }, []);

  useEffect(() => {
    const fetchSubCategoryById = async (id: string) => {
      const response = await fetch(
        `${BASE_URL}/api/subcategories/${id}`
      );
      const data = await response.json();
      return data;
    };

    const fetchItemById = async (id: string) => {
      const response = await fetch(`${BASE_URL}/api/items/${id}`);
      const data = await response.json();
      return data;
    };

    const fetchSubCategories = async () => {
      const subCategoryDetails: { [key: string]: SubCategory } = {};
      const itemDetails: { [key: string]: Item } = {};

      for (const category of categories) {
        for (const subCategoryId of category.subCategories) {
          if (!subCategoryDetails[subCategoryId]) {
            const subCategory = await fetchSubCategoryById(subCategoryId);
            subCategoryDetails[subCategoryId] = subCategory;

            for (const itemId of subCategory.items) {
              if (!itemDetails[itemId]) {
                const item = await fetchItemById(itemId);
                itemDetails[itemId] = item;
              }
            }
          }
        }
      }

      setSubCategoryDetails(subCategoryDetails);
      setItemDetails(itemDetails);
    };

    if (categories.length > 0) {
      fetchSubCategories();
    }
  }, [categories]);

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/categories/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      const err = error as Error;
      setError("Error deleting category: " + err.message);
    }
  };

  const handleEditCategory = async (id: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/categories/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: updatedCategoryName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit category");
      }
      const updatedCategory = await response.json();
      setCategories(
        categories.map((category) =>
          category._id === id ? updatedCategory : category
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      const err = error as Error;
      setError("Error editing category: " + err.message);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setIsModalOpen(false);
    } catch (error) {
      const err = error as Error;
      setError("Error adding category: " + err.message);
    }
  };

  const handleAddSubCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/subcategories`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newSubCategoryName, categoryId }),
      });
      if (!response.ok) {
        throw new Error("Failed to add subcategory");
      }
      const newSubCategory = await response.json();
      setSubCategoryDetails({
        ...subCategoryDetails,
        [newSubCategory._id]: newSubCategory,
      });
      setCategories(
        categories.map((category) => {
          if (category._id === categoryId) {
            return {
              ...category,
              subCategories: [...category.subCategories, newSubCategory._id],
            };
          }
          return category;
        })
      );
      setIsModalOpen(false);
    } catch (error) {
      const err = error as Error;
      setError("Error adding subcategory: " + err.message);
    }
  };

  const handleAddItem = async (subCategoryId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/items`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItemName,
          image: newItemImage,
          description: newItemDescription,
          // taxApplicability: newItemTaxApplicability,
          tax: newItemTax,
          baseAmount: newItemBaseAmount,
          discount: newItemDiscount,
          totalAmount: 100,
          subCategoryId,
          categoryId: currentCategory?._id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      const newItem = await response.json();
      setItemDetails({
        ...itemDetails,
        [newItem._id]: newItem,
      });
      setSubCategoryDetails({
        ...subCategoryDetails,
        [subCategoryId]: {
          ...subCategoryDetails[subCategoryId],
          items: [...subCategoryDetails[subCategoryId].items, newItem._id],
        },
      });
      setIsModalOpen(false);
    } catch (error) {
      const err = error as Error;
      setError("Error adding item: " + err.message);
    }
  };

  const openModal = (
    type: string,
    category: Category | null = null,
    subCategory: SubCategory | null = null
  ) => {
    setModalType(type);
    setCurrentCategory(category);
    setCurrentSubCategory(subCategory);

    if (type === "editSubCategory" && subCategory) {
      setUpdatedSubCategoryName(subCategory.name); 
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    setCurrentSubCategory(null);
  };

  const handleEditSubCategory = async (id: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/subcategories/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: updatedSubCategoryName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit subcategory");
      }
      const updatedSubCategory = await response.json();
      setSubCategoryDetails({
        ...subCategoryDetails,
        [id]: updatedSubCategory,
      });
      setIsModalOpen(false);
    } catch (error) {
      const err = error as Error;
      setError("Error editing subcategory: " + err.message);
    }
  };
  const handleDeleteSubCategory = async (id: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/subcategories/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete subcategory");
      }
      const updatedSubCategoryDetails = { ...subCategoryDetails };
      delete updatedSubCategoryDetails[id];
      setSubCategoryDetails(updatedSubCategoryDetails);
      setCategories(
        categories.map((category) => ({
          ...category,
          subCategories: category.subCategories.filter(
            (subCategoryId) => subCategoryId !== id
          ),
        }))
      );
    } catch (error) {
      const err = error as Error;
      setError("Error deleting subcategory: " + err.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "editCategory" && currentCategory) {
      handleEditCategory(currentCategory._id);
    } else if (modalType === "addCategory") {
      handleAddCategory();
    } else if (modalType === "addSubCategory" && currentCategory) {
      handleAddSubCategory(currentCategory._id);
    } else if (modalType === "editSubCategory" && currentSubCategory) {
      handleEditSubCategory(currentSubCategory._id);
    } else if (modalType === "addItem" && currentSubCategory) {
      handleAddItem(currentSubCategory._id);
    } 
  };
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          className="flex items-center text-blue-500 hover:text-blue-700"
          onClick={() => openModal("addCategory")}
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>
      {categories.map((category) => (
        <div
          key={category._id}
          className="mb-8 p-4 bg-white rounded-lg shadow-md"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {category.name}
            </h2>
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => openModal("editCategory", category)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteCategory(category._id)}
              >
                <FaTrashAlt />
              </button>
              <button
                className="text-green-500 hover:text-green-700"
                onClick={() => openModal("addSubCategory", category)}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <ul className="mt-4">
            {category.subCategories.map((subCategoryId) => (
              <li
                key={subCategoryId}
                className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                {subCategoryDetails[subCategoryId] ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-gray-700">
                        {subCategoryDetails[subCategoryId].name}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          openModal("editSubCategory", currentCategory, subCategoryDetails[subCategoryId])
                        }
                        >
                          <FaEdit />
                        </button>
                        <button className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSubCategory(subCategoryId)}
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() =>
                            openModal(
                              "addItem",
                              null,
                              subCategoryDetails[subCategoryId]
                            )
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <ul className="mt-2 ml-4 list-disc list-inside">
                      {subCategoryDetails[subCategoryId].items.map((itemId) => (
                        <li key={itemId} className="mt-1">
                          {itemDetails[itemId] ? (
                            <span className="text-gray-600">
                              {itemDetails[itemId].name}
                            </span>
                          ) : (
                            "Loading..."
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  "Loading..."
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {modalType === "editCategory"
              ? "Edit Category"
              : modalType === "addCategory"
              ? "Add Category"
              : modalType === "addSubCategory"
              ? "Add SubCategory"
              : "Add Item"}
          </h2>
          <form onSubmit={handleSubmit}>
            {(modalType === "editCategory" || modalType === "addCategory") && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="categoryName"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={
                    modalType === "editCategory"
                      ? updatedCategoryName
                      : newCategoryName
                  }
                  onChange={(e) =>
                    modalType === "editCategory"
                      ? setUpdatedCategoryName(e.target.value)
                      : setNewCategoryName(e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
            {(modalType === "editSubCategory" || modalType === "addSubCategory") && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="subCategoryName"
                >
                  SubCategory Name
                </label>
                <input
                  id="subCategoryName"
                  type="text"
                  value={
                    modalType === "editSubCategory"
                      ? updatedSubCategoryName
                      : newSubCategoryName
                  }
                  onChange={(e) =>
                    modalType === "editSubCategory"
                      ? setUpdatedSubCategoryName(e.target.value)
                      : setNewSubCategoryName(e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
            {modalType === "addSubCategory" && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="subCategoryName"
                >
                  SubCategory Name
                </label>
                <input
                  id="subCategoryName"
                  type="text"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            )}
            {modalType === "addItem" && (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="itemName"
                  >
                    Item Name
                  </label>
                  <input
                    id="itemName"
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="itemImage"
                  >
                    Item Image
                  </label>
                  <input
                    id="itemImage"
                    type="text"
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="itemDescription"
                  >
                    Item Description
                  </label>
                  <input
                    id="itemDescription"
                    type="text"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="itemTax"
                  >
                    Tax
                  </label>
                  <input
                    id="itemTax"
                    type="number"
                    value={newItemTax}
                    onChange={(e) => setNewItemTax(Number(e.target.value))}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="itemBaseAmount"
                  >
                    Base Amount
                  </label>
                  <input
                    id="itemBaseAmount"
                    type="number"
                    value={newItemBaseAmount}
                    onChange={(e) =>
                      setNewItemBaseAmount(Number(e.target.value))
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="itemDiscount"
                  >
                    Discount
                  </label>
                  <input
                    id="itemDiscount"
                    type="number"
                    value={newItemDiscount}
                    onChange={(e) => setNewItemDiscount(Number(e.target.value))}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {modalType === "editCategory" ? "Save Changes" : "Add"}
              </button>
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;

