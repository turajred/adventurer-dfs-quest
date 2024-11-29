import { useState, useEffect, useCallback } from "react";
import { PersonStanding, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Floor {
  number: number;
  visited: boolean;
  exploring: boolean;
}

const Index = () => {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [stack, setStack] = useState<number[]>([1]); // DFS stack starting from floor 1
  const maxFloors = 10;

  // Initialize floors
  useEffect(() => {
    const initialFloors = Array.from({ length: maxFloors }, (_, i) => ({
      number: maxFloors - i, // Reverse the floor numbers
      visited: false,
      exploring: false,
    }));
    setFloors(initialFloors);
  }, []);

  // DFS implementation
  const getNextUnvisitedFloor = useCallback((currentFloor: number, floors: Floor[]) => {
    // Look for next unvisited floor below current position
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
      // Push to stack and mark as exploring
      currentStack.push(nextFloor);
      const updatedFloors = currentFloors.map(floor => 
        floor.number === nextFloor 
          ? { ...floor, exploring: true }
          : floor
      );
      
      setStack(currentStack);
      setFloors(updatedFloors);
      setCurrentFloor(nextFloor);
      
      toast.info(`Exploring Floor ${nextFloor}!`, {
        duration: 1500,
        className: "bg-indigo-600/90 text-white",
      });
    } else {
      // Backtrack and mark current floor as visited
      if (currentStack.length > 1) {
        const floorToMark = currentStack.pop();
        const previousFloor = currentStack[currentStack.length - 1];
        
        const updatedFloors = currentFloors.map(floor => 
          floor.number === floorToMark 
            ? { ...floor, visited: true, exploring: false }
            : floor
        );
        
        setStack(currentStack);
        setFloors(updatedFloors);
        setCurrentFloor(previousFloor);
        
        toast.success(`Floor ${floorToMark} conquered! Backtracking to Floor ${previousFloor}...`, {
          duration: 1500,
          className: "bg-emerald-600/90 text-white",
        });
      } else {
        // All floors visited
        toast.success("Adventure Complete! Returning to start...", {
          duration: 2000,
          className: "bg-purple-600/90 text-white",
        });
        setStack([1]);
        setFloors(floors.map(floor => ({ ...floor, visited: false, exploring: false })));
        setCurrentFloor(1);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsJumping(false);
  };

  const getFloorColor = (floor: Floor) => {
    if (floor.number === currentFloor) return "bg-indigo-500/30 border-indigo-500/50";
    if (floor.visited) return "bg-emerald-500/20 border-emerald-500/40";
    if (floor.exploring) return "bg-amber-500/20 border-amber-500/40";
    return "bg-white/5 border-white/20";
  };

  const getFloorAnimation = (floor: Floor) => {
    if (floor.number === currentFloor) return "animate-pulse";
    if (floor.visited) return "animate-floor-conquer";
    if (floor.exploring) return "animate-exploring";
    return "";
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            DFS Adventure
          </h1>
          <p className="text-gray-300">Watch Adventurer X explore the depths</p>
        </div>

        <div className="relative space-y-4">
          {floors.map((floor) => (
            <div
              key={floor.number}
              className={`
                glass-floor rounded-lg p-4 floor-transition
                ${getFloorColor(floor)}
                ${getFloorAnimation(floor)}
                hover:shadow-lg hover:shadow-indigo-500/20
                transform transition-all duration-300
                ${floor.number === currentFloor ? 'scale-105 z-10' : 'hover:scale-102'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white">
                  Floor {floor.number}
                </span>
                {floor.number === currentFloor && (
                  <PersonStanding 
                    className={`w-6 h-6 text-indigo-400 
                      ${isJumping ? "animate-adventurer-jump" : ""}
                      filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]
                    `}
                  />
                )}
                {floor.visited && floor.number !== currentFloor && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 animate-floor-conquer" />
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
            bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600
            hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700
            disabled:from-gray-500 disabled:to-gray-600
            disabled:cursor-not-allowed
            transform hover:scale-105 active:scale-95
            shadow-lg hover:shadow-purple-500/50
          `}
        >
          {isJumping ? "Exploring..." : "Jump to Next Floor"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-300">
            Explored: {floors.filter(f => f.visited).length} / {maxFloors} floors
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;