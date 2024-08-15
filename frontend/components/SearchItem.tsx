import React, { useState, useEffect, ChangeEvent } from 'react';

interface Item {
  id: string;
  name: string;
}

const SearchItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/items/search/${searchTerm}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data: Item[] = await response.json();
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (searchTerm) {
      fetchItems();
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    if (value) {
      const filtered = items.filter(item => item.name.toLowerCase().includes(value));
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  };

  const handleSuggestionClick = (itemName: string) => {
    setSearchTerm(itemName);
    setFilteredItems([]);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {filteredItems.length > 0 && (
        <ul className="space-y-2">
          {filteredItems.map(item => (
            <li
              key={item.id}
              className="p-2 bg-white border border-gray-200 rounded shadow cursor-pointer"
              onClick={() => handleSuggestionClick(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchItems;
