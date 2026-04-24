import { AlertCircle } from "lucide-react";

interface ResultCardProps {
  icon: string;
  label: string;
  value: string;
  subvalue?: string;
  description?: string;
  priority?: "critical" | "warning" | "normal";
  alert?: string;
}

export function ResultCard({ icon, label, value, subvalue, description, priority = "normal", alert }: ResultCardProps) {
  const priorityStyles = {
    critical: "border-destructive/50 bg-destructive/5",
    warning: "border-warning/50 bg-warning/5",
    normal: "border-border bg-card"
  };

  const valueColor = priority === "critical" ? "text-destructive" : priority === "warning" ? "text-warning" : "text-foreground";

  return (
    <div className={`flex items-start gap-3 rounded-2xl border shadow-sm p-3 transition-all duration-300 ${priorityStyles[priority]}`}>
      <div className="text-2xl leading-none mt-0.5" aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-lg font-semibold ${valueColor}`}>{value}</div>
        {subvalue && <div className="text-xs text-muted-foreground mt-0.5">{subvalue}</div>}
        {description && <div className="text-xs text-muted-foreground mt-1 italic">{description}</div>}
        {alert && (
          <div className="text-xs text-destructive mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {alert}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultCard;
