import { useState, useEffect } from "react";
import { PersonStanding, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [conqueredFloors, setConqueredFloors] = useState<number[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const maxFloors = 10;

  const handleJump = async () => {
    if (isJumping) return;
    setIsJumping(true);

    const nextUnconqueredFloor = Array.from({ length: maxFloors }, (_, i) => i + 1)
      .find(floor => !conqueredFloors.includes(floor));

    if (!nextUnconqueredFloor) {
      toast.success("All floors conquered! Returning to start...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentFloor(1);
      setConqueredFloors([]);
      setIsJumping(false);
      return;
    }

    setCurrentFloor(nextUnconqueredFloor);
    await new Promise(resolve => setTimeout(resolve, 500));
    setConqueredFloors(prev => [...prev, nextUnconqueredFloor]);
    setIsJumping(false);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">DFS Visualization</h1>
          <p className="text-gray-600">Watch Adventurer X explore the depths</p>
        </div>

        <div className="relative space-y-4">
          {Array.from({ length: maxFloors }).map((_, index) => {
            const floorNumber = maxFloors - index;
            const isCurrentFloor = currentFloor === floorNumber;
            const isConquered = conqueredFloors.includes(floorNumber);

            return (
              <div
                key={floorNumber}
                className={`
                  glass-floor rounded-lg p-4 floor-transition
                  ${isConquered ? "bg-green-500/20 border-green-500/40" : ""}
                  ${isCurrentFloor ? "ring-2 ring-blue-500/50" : ""}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700">
                    Floor {floorNumber}
                  </span>
                  {isCurrentFloor && (
                    <PersonStanding 
                      className={`w-6 h-6 text-blue-600 ${isJumping ? "animate-adventurer-jump" : ""}`}
                    />
                  )}
                  {isConquered && !isCurrentFloor && (
                    <CheckCircle className="w-5 h-5 text-green-500 animate-floor-conquer" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleJump}
          disabled={isJumping}
          className={`
            w-full mt-6 px-6 py-3 rounded-lg text-white font-medium
            transition-all duration-300 ease-in-out
            ${isJumping 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600 active:transform active:scale-95"
            }
          `}
        >
          {isJumping ? "Jumping..." : "Jump to Next Floor"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Conquered: {conqueredFloors.length} / {maxFloors} floors
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;