import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./compcss/OrderForm.css";

export default function OrderForm({ onOrderPlaced, onCancel }) {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState(""); // New state for phone
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("https://project-restaurant-backend.onrender.com/api/menu", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setMenuItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Failed to load menu. Please try again.");
      }
    };
    fetchMenu();
  }, [user]);

  const handleAddItem = (menuItem) => {
    const existing = selectedItems.find((i) => i.itemId === menuItem._id);
    if (existing) {
      setSelectedItems((prev) =>
        prev.map((i) =>
          i.itemId === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          itemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          customization: "",
        },
      ]);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, quantity: parseInt(value) || 1 } : i
      )
    );
  };

  const handleCustomizationChange = (itemId, value) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, customization: value } : i
      )
    );
  };

  const calculateTotal = () =>
    selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || selectedItems.length === 0) {
      alert(
        "Please enter customer name, phone number, and select at least one item."
      );
      return;
    }

    const orderData = {
      customerName,
      customerPhone,
      items: selectedItems.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        customization: item.customization,
      })),
    };

    try {
      const res = await axios.post("https://project-restaurant-backend.onrender.com/api/orders", orderData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      toast.success("Order placed!");
      setCustomerName("");
      setCustomerPhone("");
      setSelectedItems([]);
      if (onOrderPlaced) onOrderPlaced(res.data);
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="order-form-wrapper">
      <div className="order-form-content">
        <h2>📝 New Order</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="order-form">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />

          {/* Phone number input styled like other inputs */}
          <input
            type="tel"
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />

          <div className="menu-items-grid">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="menu-item-card"
                onClick={() => handleAddItem(item)}
              >
                <strong>{item.name}</strong>
                <div>₹{item.price}</div>
              </div>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Selected Items</h3>
              {selectedItems.map((item) => (
                <div key={item.itemId} className="selected-item-row">
                  <span>{item.name}</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.itemId, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Customization"
                    value={item.customization}
                    onChange={(e) =>
                      handleCustomizationChange(item.itemId, e.target.value)
                    }
                  />
                </div>
              ))}

              <p className="order-total">Total: ₹{calculateTotal()}</p>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Place Order
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
