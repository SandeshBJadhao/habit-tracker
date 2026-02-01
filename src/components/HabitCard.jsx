import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function HabitCard({
  habit,
  doneToday,
  onToggle,
  onDelete,
}) {
  return (
    <Card className="bg-white/6 border border-white/12 backdrop-blur hover:bg-white/10 transition rounded-xl">
      <CardContent className="flex justify-between items-center p-4">
        
        <div className="flex items-center gap-3">
          <Checkbox
            checked={doneToday}
            onCheckedChange={onToggle}
            className="
              h-5 w-5 rounded-md
              border border-white/30
              data-[state=checked]:bg-emerald-500
              data-[state=checked]:border-emerald-500
              data-[state=checked]:text-white
            "
          />

          <span
            className={`text-sm transition ${
              doneToday
                ? "line-through text-slate-400"
                : "text-slate-200"
            }`}
          >
            {habit.name}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          ✕
        </Button>
      </CardContent>
    </Card>
  );
}