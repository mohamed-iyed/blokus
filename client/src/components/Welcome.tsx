import { useAppContext } from "../context";
import NavBtn from "./NavButton";

export default function Welcome() {
  const { setStep } = useAppContext();

  return (
    <section className="flex flex-col justify-evenly gap-6">
      <h1 className="text-xl font-bold text-[#282828]">
        Welcome To The Blokus Game
      </h1>
      <div className="flex flex-col gap-3">
        <NavBtn
          text="Create Game"
          cb={() => setStep({ type: "createGame", number: 1 })}
        />
        <NavBtn
          text="Join Game"
          cb={() => setStep({ type: "joinGame", number: 1 })}
        />
      </div>
    </section>
  );
}
