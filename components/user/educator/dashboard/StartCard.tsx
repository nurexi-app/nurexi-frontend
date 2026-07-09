export default function StatCard({ stat }: { stat: any }) {
  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h5 className="text-grey font-normal">{stat.title}</h5>
        {stat.growth !== null && stat.growth !== undefined && (
          <small
            className={`${stat.growth >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {stat.growth >= 0 ? "+" : ""}
            {stat.growth}%
          </small>
        )}
        {stat.subtitle && (
          <small className="text-muted-foreground text-xs">
            {stat.subtitle}
          </small>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-medium text-2xl">{stat.value}</h2>
        <stat.icon size={48} className={stat.color} />
      </div>
    </div>
  );
}
