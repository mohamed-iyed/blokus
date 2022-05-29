import NavBtn from "./NavButton";

function Step1() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-center">Create Game</h1>
      <div className="flex flex-wrap gap-2">
        <label
          htmlFor="red"
          className="bg-red-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Red</p>
          <input type="checkbox" value="red" id="red" />
        </label>
        <label
          htmlFor="Green"
          className="bg-green-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Green</p>
          <input type="checkbox" value="Green" id="Green" />
        </label>
        <label
          htmlFor="blue"
          className="bg-blue-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Blue</p>
          <input type="checkbox" value="blue" id="blue" />
        </label>
        <label
          htmlFor="yellow"
          className="bg-yellow-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Yellow</p>
          <input type="checkbox" value="yellow" id="yellow" />
        </label>
      </div>
      <p className="text-gray-400 text-sm font-light text-center">
        if you dont choose a color then a bot will take its place
      </p>
      <NavBtn type="next" text="Next" event="CREATE_GAME" />
      <NavBtn type="back" text="Back" />
    </div>
  );
}
function Step2() {
  return (
    <div>
      <h2>Game Code : </h2>
      <NavBtn type="next" text="Start" />
      <NavBtn type="back" text="Cancel" event="DELETE_GAME" />
    </div>
  );
}
interface Props {
  step: number;
}

export default function CreateGame({ step }: Props) {
  switch (step) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    default:
      return <Step1 />;
  }
}
