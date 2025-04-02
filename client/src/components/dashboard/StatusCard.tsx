import { StatusCardProps } from "@/lib/types";
import { getIconColor, getTrendIcon, getTrendColor } from "@/lib/utils";

export default function StatusCard({ icon, title, value, color, trend, trendDirection }: StatusCardProps) {
  const iconColorClass = getIconColor(color);
  const trendColorClass = getTrendColor(trendDirection || "");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconColorClass} mr-4`}>
          <i className={`fa-solid ${icon} text-xl`}></i>
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-slate-800">{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-xs ${trendColorClass}`}>
          <i className={getTrendIcon(trendDirection || "")}></i>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
