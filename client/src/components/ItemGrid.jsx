import ItemCard from "./ItemCard.jsx";

export default function ItemGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty">
        <h3>No items found</h3>
        <p>Try adjusting your search or filter.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}