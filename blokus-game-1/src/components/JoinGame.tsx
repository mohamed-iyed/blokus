import NavBtn from "./NavButton";

interface Props {
  step: number;
}

function Step1() {
  return (
    <div className="flex flex-col ">
      <h2>Join a Game</h2>
      <input type="text" placeholder="game code .." />
      <NavBtn type="back" text="Back" />
      <NavBtn type="next" text="Confirm" />
    </div>
  );
}
export default function JoinGame({ step }: Props) {
  switch (step) {
    case 1:
      return <Step1 />;
    default:
      return <Step1 />;
  }
}
