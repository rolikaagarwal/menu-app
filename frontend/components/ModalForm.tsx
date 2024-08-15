import React from "react";
import Modal from "react-modal";

interface ModalFormProps {
  isModalOpen: boolean;
  closeModal: () => void;
  modalType: string;
  handleSubmit: (e: React.FormEvent) => void;
  updatedCategoryName: string;
  setUpdatedCategoryName: (name: string) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  newSubCategoryName: string;
  setNewSubCategoryName: (name: string) => void;
  newItemName: string;
  setNewItemName: (name: string) => void;
  newItemImage: string;
  setNewItemImage: (url: string) => void;
  newItemDescription: string;
  setNewItemDescription: (description: string) => void;
  newItemTaxApplicability: boolean;
  setNewItemTaxApplicability: (applicable: boolean) => void;
  newItemTax: number;
  setNewItemTax: (tax: number) => void;
  newItemBaseAmount: number;
  setNewItemBaseAmount: (amount: number) => void;
  newItemDiscount: number;
  setNewItemDiscount: (discount: number) => void;
  newItemTotalAmount: number;
  setNewItemTotalAmount: (amount: number) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isModalOpen,
  closeModal,
  modalType,
  handleSubmit,
  updatedCategoryName,
  setUpdatedCategoryName,
  newCategoryName,
  setNewCategoryName,
  newSubCategoryName,
  setNewSubCategoryName,
  newItemName,
  setNewItemName,
  newItemImage,
  setNewItemImage,
  newItemDescription,
  setNewItemDescription,
  newItemTaxApplicability,
  setNewItemTaxApplicability,
  newItemTax,
  setNewItemTax,
  newItemBaseAmount,
  setNewItemBaseAmount,
  newItemDiscount,
  setNewItemDiscount,
  newItemTotalAmount,
  setNewItemTotalAmount,
}) => {
  return (
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
          {modalType === "editCategory" && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={updatedCategoryName}
                onChange={(e) => setUpdatedCategoryName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          {modalType === "addCategory" && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          {modalType === "addSubCategory" && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                SubCategory Name
              </label>
              <input
                type="text"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          {modalType === "addItem" && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Item Image URL
                </label>
                <input
                  type="text"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Item Description
                </label>
                <textarea
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tax Applicability
                </label>
                <input
                  type="checkbox"
                  checked={newItemTaxApplicability}
                  onChange={(e) => setNewItemTaxApplicability(e.target.checked)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tax
                </label>
                <input
                  type="number"
                  value={newItemTax}
                  onChange={(e) => setNewItemTax(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Base Amount
                </label>
                <input
                  type="number"
                  value={newItemBaseAmount}
                  onChange={(e) => setNewItemBaseAmount(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Discount
                </label>
                <input
                  type="number"
                  value={newItemDiscount}
                  onChange={(e) => setNewItemDiscount(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Total Amount
                </label>
                <input
                  type="number"
                  value={newItemTotalAmount}
                  onChange={(e) => setNewItemTotalAmount(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </>
          )}
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {modalType === "editCategory"
                ? "Save Changes"
                : modalType === "addCategory"
                ? "Add Category"
                : modalType === "addSubCategory"
                ? "Add SubCategory"
                : "Add Item"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalForm;
