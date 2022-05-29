import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import Welcome from "./components/Welcome";
import { useAppContext } from "./context";

export default function App() {
  const { step } = useAppContext();
  let content;

  switch (true) {
    case step.number === 0 && step.type === null:
      content = <Welcome />;
      break;
    case step.number !== 0 && step.type === "createGame":
      content = <CreateGame step={step.number} />;
      break;
    case step.number !== 0 && step.type === "joinGame":
      content = <JoinGame step={step.number} />;
      break;
    default:
      content = <Welcome />;
  }
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="container flex justify-center py-6 px-4 w-[300px] sm:max-w-[400px] sm:w-full min-h-[200px] bg-white rounded-md border shadow-md">
        {content}
      </div>
    </main>
  );
}
