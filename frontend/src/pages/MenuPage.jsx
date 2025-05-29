import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/menupage.css";
import { useAuth } from "../context/AuthContext";

export default function MenuPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [menu, setMenu] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemData, setItemData] = useState({
    name: "",
    price: "",
    category: "",
    ingredients: "",
    tags: "",
    available: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/api/menu");
      setMenu(res.data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...itemData,
        price: parseFloat(itemData.price),
        ingredients: itemData.ingredients.split(",").map((i) => i.trim()),
        tags: itemData.tags.split(",").map((t) => t.trim()),
      };

      if (editItem) {
        await axios.put(`/api/menu/${editItem._id}`, payload);
      } else {
        await axios.post("/api/menu", payload);
      }

      setShowForm(false);
      setEditItem(null);
      setItemData({
        name: "",
        price: "",
        category: "",
        ingredients: "",
        tags: "",
        available: true,
      });
      fetchMenu();
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setItemData({
      name: item.name,
      price: item.price,
      category: item.category,
      ingredients: item.ingredients?.join(", "),
      tags: item.tags?.join(", "),
      available: item.available,
    });
    setShowForm(true);
  };

  const filteredMenu = menu.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || item.category === selectedCategory)
  );

  const uniqueCategories = [
    "All",
    ...new Set(menu.map((item) => item.category)),
  ];
  
  return (
    <div className="menu-container">
      <div className="menu-header">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {uniqueCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        {isAdmin && (
          <button className="add-item-btn" onClick={() => setShowForm(true)}>
            + Add Item
          </button>
        )}
      </div>

      <div className="menu-grid">
        {filteredMenu.map((item) => (
          <div key={item._id} className="menu-card">
            <div className="menu-card-header">
              <h3>{item.name}</h3>
              <div className="menu-card-actions">
                <button onClick={() => handleEdit(item)}>✏️</button>
                <button onClick={() => handleDelete(item._id)}>🗑️</button>
              </div>
            </div>
            <p className="price">₹{item.price}</p>
            <span className="badge">{item.category}</span>
            <div className="tags">
              {item.tags?.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <button className="status-btn">
              {item.available ? "Available" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <form className="modal-form" onSubmit={handleSubmit}>
            <h2>{editItem ? "Edit Item" : "Add New Item"}</h2>

            <label>
              Name
              <input
                type="text"
                value={itemData.name}
                onChange={(e) =>
                  setItemData({ ...itemData, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Price
              <input
                type="number"
                value={itemData.price}
                onChange={(e) =>
                  setItemData({ ...itemData, price: e.target.value })
                }
                required
              />
            </label>

            <label>
              Category
              <input
                type="text"
                value={itemData.category}
                onChange={(e) =>
                  setItemData({ ...itemData, category: e.target.value })
                }
              />
            </label>

            <label>
              Ingredients (comma-separated)
              <input
                type="text"
                value={itemData.ingredients}
                onChange={(e) =>
                  setItemData({ ...itemData, ingredients: e.target.value })
                }
              />
            </label>

            <label>
              Tags (comma-separated)
              <input
                type="text"
                value={itemData.tags}
                onChange={(e) =>
                  setItemData({ ...itemData, tags: e.target.value })
                }
              />
            </label>

            <label>
              Available
              <input
                type="checkbox"
                checked={itemData.available}
                onChange={(e) =>
                  setItemData({ ...itemData, available: e.target.checked })
                }
              />
            </label>

            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
