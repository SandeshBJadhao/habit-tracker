import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ value }) {
  return (
    <div className="space-y-1">
      <Progress value={value} />
      <p className="text-xs text-muted-foreground">{value}%</p>
    </div>
  );
}