import { useMemo, useState } from "react";
import type { PlayerProfile } from "../types/game";

type IntroScreenProps = {
  onComplete: (profile: PlayerProfile) => void;
};

type OpeningBeat = {
  art: string;
  speaker: "司書" | "The Censor" | "主人公" | "本" | " ";
  text: string;
  caption?: string;
  camera: "fade" | "panRight" | "pushIn" | "shake" | "lowGlow" | "twoShot" | "portal" | "lodge";
  tone?: "dark" | "hope" | "danger" | "white";
  books?: string[];
  titleCard?: boolean;
};

const openingAsset = (fileName: string) => `${import.meta.env.BASE_URL}assets/opening/${fileName}`;

const openingBeats: OpeningBeat[] = [
  {
    art: openingAsset("opening-bibliotheca.png"),
    speaker: " ",
    text: "ページをめくる音だけが、暗闇に落ちていく。",
    caption: "Scene 1",
    camera: "fade",
    tone: "dark",
  },
  {
    art: openingAsset("opening-bibliotheca.png"),
    speaker: "司書",
    text: "ここは Bibliotheca。",
    camera: "pushIn",
  },
  {
    art: openingAsset("opening-bibliotheca.png"),
    speaker: "司書",
    text: "イギリス文学史に刻まれた物語が眠る、世界の記憶の図書館。",
    camera: "panRight",
  },
  {
    art: openingAsset("opening-bibliotheca.png"),
    speaker: "司書",
    text: "人々は何百年もの間、炎のそばで、劇場で、教室で、物語を語り継いできた。",
    camera: "panRight",
    books: ["Beowulf", "Hamlet", "Macbeth", "Frankenstein", "Sherlock Holmes", "1984"],
  },
  {
    art: openingAsset("opening-censor.png"),
    speaker: " ",
    text: "その夜、棚の奥で灯りがひとつ消えた。",
    camera: "shake",
    tone: "danger",
  },
  {
    art: openingAsset("opening-censor.png"),
    speaker: "The Censor",
    text: "忘れられた物語に価値はない。",
    camera: "pushIn",
    tone: "danger",
  },
  {
    art: openingAsset("opening-erased-books.png"),
    speaker: "司書",
    text: "待て。そこにあるのは、ただの文字ではない。人が人であろうとした証だ。",
    camera: "shake",
    tone: "danger",
    books: ["Beowulf", "Hamlet", "Macbeth", "Frankenstein", "Sherlock Holmes"],
  },
  {
    art: openingAsset("opening-erased-books.png"),
    speaker: " ",
    text: "ページから名が消える。英雄も、王も、怪物も、探偵も、白紙の沈黙へ沈んでいく。",
    camera: "lowGlow",
    tone: "dark",
    books: ["Beowulf -> blank", "Hamlet -> blank", "Macbeth -> blank", "Frankenstein -> blank", "Sherlock Holmes -> blank"],
  },
  {
    art: openingAsset("opening-reading-gift.png"),
    speaker: "主人公",
    text: "……これは？",
    camera: "lowGlow",
    tone: "hope",
  },
  {
    art: openingAsset("opening-reading-gift.png"),
    speaker: "本",
    text: "Beowulf",
    camera: "lowGlow",
    tone: "hope",
  },
  {
    art: openingAsset("opening-reading-gift.png"),
    speaker: "司書",
    text: "……見えるのか？ その本はもう、誰にも読めないはずだ。",
    camera: "pushIn",
    tone: "hope",
  },
  {
    art: openingAsset("opening-librarian.png"),
    speaker: "司書",
    text: "君の目は、消された物語の名を拾い上げる。古い言葉では、それを Reading Gift と呼ぶ。",
    camera: "twoShot",
    tone: "hope",
  },
  {
    art: openingAsset("opening-librarian.png"),
    speaker: "司書",
    text: "物語が消えれば、歴史も消える。歴史が消えれば、人々は自分たちが何者だったのかさえ忘れてしまう。",
    camera: "twoShot",
  },
  {
    art: openingAsset("opening-librarian.png"),
    speaker: "司書",
    text: "君だけが、この白紙の向こうを読める。君だけが、Bibliotheca を救える。",
    camera: "pushIn",
    tone: "hope",
  },
  {
    art: openingAsset("opening-librarian.png"),
    speaker: "司書",
    text: "この本を開け。失われた伝説は、君が続きを読まなければ戻らない。",
    camera: "portal",
    tone: "hope",
  },
  {
    art: openingAsset("opening-librarian.png"),
    speaker: " ",
    text: "光がページから溢れ、あなたの足元を、そして図書館そのものを飲み込んだ。",
    camera: "portal",
    tone: "white",
  },
  {
    art: openingAsset("opening-lodge.png"),
    speaker: " ",
    text: "British Legends",
    caption: "失われた物語を取り戻す冒険が始まる。",
    camera: "lodge",
    tone: "hope",
    titleCard: true,
  },
];

function playPageTurn() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const audio = new AudioContextClass();
  const duration = 0.22;
  const bufferSize = audio.sampleRate * duration;
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    const t = i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.4) * 0.22;
  }

  const noise = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();

  noise.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, audio.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2800, audio.currentTime + duration);
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audio.currentTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);
  noise.start();
  noise.stop(audio.currentTime + duration);
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [beatIndex, setBeatIndex] = useState(0);
  const beat = openingBeats[beatIndex];
  const progress = useMemo(() => ((beatIndex + 1) / openingBeats.length) * 100, [beatIndex]);

  function finishOpening() {
    onComplete({
      name: "Reader",
      professionId: "office",
    });
  }

  function nextBeat() {
    playPageTurn();
    if (beatIndex >= openingBeats.length - 1) {
      finishOpening();
      return;
    }
    setBeatIndex((current) => current + 1);
  }

  return (
    <section
      className={`bl-opening bl-opening--${beat.camera} bl-opening--${beat.tone ?? "dark"}`}
      onClick={nextBeat}
      aria-label="British Legends opening"
    >
      <img key={beat.art} className="bl-opening__art" src={beat.art} alt="" />
      <div className="bl-opening__vignette" />
      <div className="bl-opening__mist" />
      <div className="bl-opening__progress" style={{ transform: `scaleX(${progress / 100})` }} />

      <button
        type="button"
        className="bl-opening__skip"
        onClick={(event) => {
          event.stopPropagation();
          finishOpening();
        }}
      >
        Skip
      </button>

      {beat.books && (
        <div className="bl-opening__spines" aria-hidden="true">
          {beat.books.map((book) => (
            <span key={book}>{book}</span>
          ))}
        </div>
      )}

      {beat.titleCard ? (
        <div className="bl-opening__title-card">
          <p>{beat.caption}</p>
          <h1>{beat.text}</h1>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextBeat();
            }}
          >
            Bibliotheca Lodge へ
          </button>
        </div>
      ) : (
        <div className="bl-opening__dialogue" role="button" tabIndex={0}>
          {beat.caption && <span className="bl-opening__caption">{beat.caption}</span>}
          {beat.speaker.trim() && <strong className="bl-opening__speaker">{beat.speaker}</strong>}
          <p>{beat.text}</p>
          <span className="bl-opening__prompt">Click</span>
        </div>
      )}
    </section>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
