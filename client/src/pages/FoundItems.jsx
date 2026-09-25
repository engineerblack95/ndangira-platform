import { useEffect, useState } from "react";
import ItemGrid from "../components/ItemGrid.jsx";
import Loader from "../components/Loader.jsx";
import { getItems } from "../api/api.js";
import { categories } from "../data/mockData.js";

export default function FoundItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const data = await getItems({ type: "found", search, category });
      if (active) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [search, category]);

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Found Items</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by title, description, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : <ItemGrid items={items} />}
    </div>
  );
}