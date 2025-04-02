import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  iconBackgroundColor: string;
  iconColor: string;
  benefits: string[];
  buttonText: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  iconBackgroundColor,
  iconColor,
  benefits,
  buttonText,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
      <div className="p-5 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", iconBackgroundColor)}>
            <span className={cn("material-icons", iconColor)}>{icon}</span>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-zinc-600 mb-4">{description}</p>
        
        <div className="mt-2 space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="material-icons text-green-500 text-sm">check_circle</span>
              <span className="text-sm text-zinc-700">{benefit}</span>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4 w-full text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default FeatureCard;
