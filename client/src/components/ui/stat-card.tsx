import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconBackgroundColor: string;
  iconColor: string;
  changeValue?: string;
  changeLabel?: string;
  changeDirection?: "up" | "down" | "neutral";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBackgroundColor,
  iconColor,
  changeValue,
  changeLabel,
  changeDirection = "neutral",
}) => {
  const getChangeColor = () => {
    if (changeDirection === "up") return "text-green-500";
    if (changeDirection === "down") return "text-red-500";
    return "text-amber-500";
  };

  const getChangeIcon = () => {
    if (changeDirection === "up") return "arrow_upward";
    if (changeDirection === "down") return "arrow_downward";
    return "check_circle";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", iconBackgroundColor)}>
          <span className={cn("material-icons", iconColor)}>{icon}</span>
        </div>
      </div>
      {(changeValue || changeLabel) && (
        <div className="mt-4 flex items-center">
          {changeValue && (
            <span className={cn("text-xs font-medium flex items-center", getChangeColor())}>
              <span className="material-icons text-sm">{getChangeIcon()}</span> {changeValue}
            </span>
          )}
          {changeLabel && (
            <span className="text-xs text-zinc-500 ml-2">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
