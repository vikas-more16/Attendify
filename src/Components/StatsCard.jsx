function StatsCard({ title, value }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="bg-white p-3 rounded shadow-sm text-center">
        <h6 className="text-muted">{title}</h6>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default StatsCard;
