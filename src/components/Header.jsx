import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-xl font-bold">Today · Jan 28</h1>
      <Button variant="ghost" className="text-orange-500">
        🔥 18
      </Button>
    </header>
  );
}