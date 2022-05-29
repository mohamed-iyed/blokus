import { useAppContext } from "../context";

export default function Welcome() {
  const { setStep } = useAppContext();

  return (
    <section className="flex flex-col justify-evenly">
      <h1 className="text-xl font-bold text-[#282828]">
        Welcome To The Blokus Game
      </h1>
      <div className="flex flex-col gap-3">
        <button
          className="btn"
          onClick={() => setStep({ number: 1, type: "createGame" })}
        >
          Create Game
        </button>
        <button
          className="btn"
          onClick={() => setStep({ number: 1, type: "joinGame" })}
        >
          Join Game
        </button>
      </div>
    </section>
  );
}
