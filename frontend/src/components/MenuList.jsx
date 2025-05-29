import { useEffect, useState } from "react";
import api from "../api/axios";

function MenuList() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/menu")
      .then(res => setMenu(res.data))
      .catch(err => console.error("Error fetching menu:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading menu...</p>;

  return (
    <div className="menu-list">
      {menu.map(item => (
        <div key={item._id} className="menu-item">
          <h3>{item.name}</h3>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Price:</strong> ₹{item.price}</p>
          <p><strong>Tags:</strong> {item.tags.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default MenuList;
