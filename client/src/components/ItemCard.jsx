import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  const detailPath = `/${item.type}/${item.id}`;
  const image = item.images && item.images.length > 0 ? item.images[0] : null;

  return (
    <Link to={detailPath} style={{ textDecoration: "none", color: "inherit" }}>
      <article className="card">
        {image ? (
          <img src={image} alt={item.title} className="card-img" />
        ) : (
          <div className="card-img-placeholder">No image</div>
        )}

        <div className="card-body">
          <div className="details-meta" style={{ marginBottom: "0.5rem" }}>
            <span className={`badge ${item.type === "lost" ? "badge-lost" : "badge-found"}`}>
              {item.type}
            </span>
            <span className="badge badge-category">{item.category}</span>
          </div>

          <h3 className="card-title">{item.title}</h3>
          <p className="card-desc">{item.description}</p>

          <div className="card-meta">
            <span>📍 {item.location}</span>
            {item.reward ? <span className="reward">RWF {Number(item.reward).toLocaleString()}</span> : null}
          </div>
        </div>
      </article>
    </Link>
  );
}