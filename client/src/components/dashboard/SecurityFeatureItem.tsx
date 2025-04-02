import React from "react";

interface SecurityFeatureItemProps {
  icon: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  onConfigure: () => void;
}

export default function SecurityFeatureItem({
  icon,
  title,
  description,
  children,
  onConfigure,
}: SecurityFeatureItemProps) {
  return (
    <div className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-start">
        <div className="mr-4 mt-1 text-slate-400">
          <i className={`fa-solid ${icon} text-xl`}></i>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mb-2">{description}</p>
          {children && <div className="mb-2">{children}</div>}
        </div>
        <div className="ml-2">
          <button
            onClick={onConfigure}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
}
