import { useState, useEffect, useCallback } from "react";
import { PersonStanding, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Floor {
  number: number;
  visited: boolean;
}

const Index = () => {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [stack, setStack] = useState<number[]>([1]); // DFS stack
  const maxFloors = 10;

  // Initialize floors
  useEffect(() => {
    const initialFloors = Array.from({ length: maxFloors }, (_, i) => ({
      number: i + 1,
      visited: false,
    }));
    setFloors(initialFloors);
  }, []);

  // DFS implementation
  const getNextUnvisitedFloor = useCallback((currentFloor: number, floors: Floor[]) => {
    // In DFS, we look for the deepest unvisited floor from current position
    for (let i = currentFloor + 1; i <= maxFloors; i++) {
      if (!floors.find(f => f.number === i)?.visited) {
        return i;
      }
    }
    return null;
  }, []);

  const handleJump = async () => {
    if (isJumping) return;
    setIsJumping(true);

    const currentStack = [...stack];
    const currentFloors = [...floors];
    
    // DFS logic
    const nextFloor = getNextUnvisitedFloor(currentStack[currentStack.length - 1], currentFloors);
    
    if (nextFloor) {
      // Push to stack and mark as visited
      currentStack.push(nextFloor);
      const updatedFloors = currentFloors.map(floor => 
        floor.number === nextFloor ? { ...floor, visited: true } : floor
      );
      
      setStack(currentStack);
      setFloors(updatedFloors);
      setCurrentFloor(nextFloor);
      
      toast.success(`Floor ${nextFloor} discovered!`, {
        duration: 1500,
      });
    } else {
      // Backtrack if no unvisited floors remain
      if (currentStack.length > 1) {
        currentStack.pop();
        setStack(currentStack);
        setCurrentFloor(currentStack[currentStack.length - 1]);
      } else {
        // All floors visited
        toast.success("All floors conquered! Returning to start...", {
          duration: 2000,
        });
        setStack([1]);
        setFloors(floors.map(floor => ({ ...floor, visited: false })));
        setCurrentFloor(1);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsJumping(false);
  };

  const getFloorColor = (floor: Floor) => {
    if (floor.number === currentFloor) return "bg-blue-500/20 border-blue-500/40";
    if (floor.visited) return "bg-green-500/20 border-green-500/40";
    return "";
  };

  const getFloorAnimation = (floor: Floor) => {
    if (floor.number === currentFloor) return "animate-pulse";
    if (floor.visited) return "animate-floor-conquer";
    return "";
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2 mb-8 text-white">
          <h1 className="text-3xl font-semibold">DFS Visualization</h1>
          <p className="text-gray-300">Watch Adventurer X explore the depths</p>
        </div>

        <div className="relative space-y-4">
          {[...floors].reverse().map((floor) => (
            <div
              key={floor.number}
              className={`
                glass-floor rounded-lg p-4 floor-transition
                ${getFloorColor(floor)}
                ${getFloorAnimation(floor)}
                hover:shadow-lg hover:shadow-blue-500/20
                transform transition-all duration-300
                ${floor.number === currentFloor ? 'scale-105' : 'hover:scale-102'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white">
                  Floor {floor.number}
                </span>
                {floor.number === currentFloor && (
                  <PersonStanding 
                    className={`w-6 h-6 text-blue-400 
                      ${isJumping ? "animate-adventurer-jump" : ""}
                      filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]
                    `}
                  />
                )}
                {floor.visited && floor.number !== currentFloor && (
                  <CheckCircle className="w-5 h-5 text-green-400 animate-floor-conquer" />
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleJump}
          disabled={isJumping}
          className={`
            w-full mt-6 px-6 py-3 rounded-lg text-white font-medium
            transition-all duration-300 ease-in-out
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            disabled:from-gray-500 disabled:to-gray-600
            disabled:cursor-not-allowed
            transform hover:scale-105 active:scale-95
            shadow-lg hover:shadow-blue-500/50
          `}
        >
          {isJumping ? "Jumping..." : "Jump to Next Floor"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-300">
            Conquered: {floors.filter(f => f.visited).length} / {maxFloors} floors
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;