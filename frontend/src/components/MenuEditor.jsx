import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function MenuEditor() {
  const { role } = useAuth();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    ingredients: "",
    tags: "",
    availability: true,
  });


  if (role !== "admin") return null; // 👀 Hide if not admin
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        tags: form.tags.split(",").map(t => t.trim()),
        ingredients: form.ingredients.split(",").map(i => i.trim()),
      };
      await api.post("/menu", payload);
      alert("Menu item created!");
      setForm({ name: "", category: "", price: "", ingredients: "", tags: "", availability: true });
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create menu item.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h2>➕ Create New Menu Item</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required />
      <input name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Ingredients (comma-separated)" />
      <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
      <label>
        <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange} />
        Available
      </label>
      <button type="submit">Create</button>
    </form>
  );
}

export default MenuEditor;
