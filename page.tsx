"use client";
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

enum Category {
  Food = 'Food',
  Electronics = 'Electronics',
  Clothes = 'Clothes',
  Mechanics = 'Mechanics',
  Toys='Toys'
}

interface Item {
  id: string;
  content: string;
  category: Category;
}

const categories: readonly Category[] = Object.values(Category);

const Home: React.FC = (): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [items, setItems] = useState<readonly Item[]>([]);

  useEffect(() => {
    document.body.classList.add('bg-gray-900', 'text-white');

    return () => {
      document.body.classList.remove('bg-gray-900', 'text-white');
    };
  }, []);

  const handleAddItem = (): void => {
    if (!inputValue.trim()) {
      alert("Please enter a value.");
      return;
    }
    const newItem: Item = {
      id: `${items.length}-${inputValue}`,
      content: inputValue,
      category: selectedCategory,
    };
    setItems(prevItems => [...prevItems, newItem]);
    setInputValue('');
  };

  const handleDeleteItem = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const handleDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    const updatedItems = Array.from(items);
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);

    setItems(updatedItems);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-800 text-white rounded-lg shadow-lg mt-10">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter item"
          className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Category)}
          className="p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category} className="bg-gray-700 text-white">
              {category}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-gray-700 p-4 rounded shadow-inner min-h-[100px]"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex justify-between items-center p-2 mb-2 bg-gray-600 border border-gray-500 rounded ${
                        snapshot.isDragging ? 'bg-gray-500' : ''
                      }`}
                    >
                      <span className="text-white">{item.content} ({item.category})</span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Home;
