"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

export default function Home() {
  const [teams, setTeams] = useState<string[]>([])
  const [teamName, setTeamName] = useState("")

  const [songs, setSongs] = useState<any[]>([])

  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [year, setYear] = useState("")
  const [file, setFile] = useState<any>(null)

  const [timeLeft, setTimeLeft] =
    useState(300)

  const [winner, setWinner] =
    useState("")

  const audioRef = useRef<any>(null)

  useEffect(() => {
    const saved =
      localStorage.getItem("songs")

    if (saved) {
      setSongs(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "songs",
      JSON.stringify(songs)
    )
  }, [songs])

  useEffect(() => {
    if (!winner) return

    if (timeLeft <= 0) {
      setTeams([])
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, winner])

  function addTeam() {
    if (!teamName) return

    setTeams([...teams, teamName])
    setTeamName("")
  }

  function addSong() {
    if (!file || !title || !artist || !year)
      return

    const newSong = {
      title,
      artist,
      year,
      file: URL.createObjectURL(file),
      flipped: false,
      team: "",
    }

    setSongs([...songs, newSong])

    setTitle("")
    setArtist("")
    setYear("")
    setFile(null)
  }

  function flipCard(index: number) {
    const copy = [...songs]

    copy[index].flipped =
      !copy[index].flipped

    setSongs(copy)
  }

  function setTeam(index: number, team: string) {
    const copy = [...songs]

    copy[index].team = team

    setSongs(copy)

    const teamSongs = copy.filter(
      (song) => song.team === team
    )

    if (teamSongs.length >= 10) {
      setWinner(team)
    }
  }

  function removeSong(index: number) {
    const copy = [...songs]

    copy.splice(index, 1)

    setSongs(copy)
  }

  function playSong(song: any) {
    if (!audioRef.current) return

    audioRef.current.src = song.file

    audioRef.current.play()

    setTimeout(() => {
      audioRef.current.pause()
    }, 60000)
  }

  function pauseSong() {
    if (!audioRef.current) return

    audioRef.current.pause()
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <audio ref={audioRef} />

      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 px-6 py-3 rounded-2xl z-50">
        <p className="text-2xl font-bold text-center">
          ⏰ {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60)
            .toString()
            .padStart(2, "0")}
        </p>

        {winner && (
          <p className="text-green-400 text-center mt-2">
            🏆 {winner} heeft gewonnen!
          </p>
        )}
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <h1 className="text-6xl font-bold mb-10 text-cyan-400">
            TIMELINE BEATS
          </h1>

          <div className="bg-gray-950 p-6 rounded-3xl mb-10 inline-block border border-cyan-500">
            <h2 className="text-3xl mb-6">
              Nummer toevoegen
            </h2>

            <div className="flex flex-col gap-4">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Titel"
                className="p-3 rounded-xl text-white bg-gray-900"
              />

              <input
                value={artist}
                onChange={(e) =>
                  setArtist(e.target.value)
                }
                placeholder="Artiest"
                className="p-3 rounded-xl text-white bg-gray-900"
              />

              <input
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                placeholder="Jaartal"
                className="p-3 rounded-xl text-white bg-gray-900"
              />

              <input
                type="file"
                accept="audio/mp3"
                onChange={(e: any) =>
                  setFile(e.target.files[0])
                }
                className="p-3 rounded-xl bg-gray-900"
              />

              <button
                onClick={addSong}
                className="bg-cyan-500 text-black p-3 rounded-xl font-bold"
              >
                Voeg kaart toe
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-max">
              {songs
                .sort(
                  (a, b) =>
                    Number(a.year) -
                    Number(b.year)
                )
                .map((song, index) => (
                  <div
                    key={index}
                    className="relative rounded-[40px] overflow-hidden w-[320px] h-[500px] flex flex-col justify-between bg-cover bg-center border-[6px] border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.4)]"
                    style={{
                      backgroundImage: `url(${
                        !song.flipped
                          ? "/card-back.png"
                          : "/card-front.png"
                      })`,
                    }}
                  >
                    {!song.flipped ? (
                      <div className="p-8 h-full flex flex-col justify-between bg-black/30 backdrop-blur-sm">
                        <div>
                          <p className="text-7xl mb-6 text-cyan-300 drop-shadow-[0_0_20px_cyan]">
                            🎵
                          </p>

                          <p className="text-3xl font-bold text-white">
                            Raad het nummer
                          </p>
                        </div>

                        <div className="flex flex-col gap-4">
                          <button
                            onClick={() =>
                              playSong(song)
                            }
                            className="bg-cyan-400 text-black p-3 rounded-xl text-xl font-bold"
                          >
                            PLAY 60 SEC
                          </button>

                          <button
                            onClick={pauseSong}
                            className="bg-yellow-400 text-black p-3 rounded-xl text-xl font-bold"
                          >
                            PAUZE
                          </button>

                          <button
                            onClick={() =>
                              flipCard(index)
                            }
                            className="bg-white text-black p-3 rounded-xl text-xl font-bold"
                          >
                            FLIP
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 h-full flex flex-col justify-between bg-white/70 backdrop-blur-sm">
                        <div>
                          <p className="text-5xl font-black mb-4 text-black">
                            {song.year}
                          </p>

                          <p className="text-3xl mb-2 text-black font-bold">
                            {song.title}
                          </p>

                          <p className="text-2xl text-black">
                            {song.artist}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-6">
                          {teams.map(
                            (team, teamIndex) => (
                              <button
                                key={teamIndex}
                                onClick={() =>
                                  setTeam(
                                    index,
                                    team
                                  )
                                }
                                className="bg-cyan-500 text-black p-2 rounded-xl font-bold"
                              >
                                Geef aan {team}
                              </button>
                            )
                          )}
                        </div>

                        {song.team && (
                          <p className="mt-4 text-green-700 font-bold">
                            Kaart staat bij:{" "}
                            {song.team}
                          </p>
                        )}

                        <button
                          onClick={() =>
                            flipCard(index)
                          }
                          className="bg-white border border-black text-black mt-4 p-2 rounded-xl font-bold"
                        >
                          DRAAI TERUG
                        </button>

                        <button
                          onClick={() =>
                            removeSong(index)
                          }
                          className="bg-red-500 mt-4 p-2 rounded-xl font-bold"
                        >
                          Verwijder kaart
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="w-[320px]">
          <div className="sticky top-6 bg-gray-950 p-6 rounded-3xl border border-cyan-500">
            <h2 className="text-3xl mb-6 text-cyan-400">
              Teams
            </h2>

            <div className="flex gap-2 mb-6">
              <input
                value={teamName}
                onChange={(e) =>
                  setTeamName(e.target.value)
                }
                placeholder="Team naam"
                className="p-3 rounded-xl text-white bg-gray-900 w-full"
              />

              <button
                onClick={addTeam}
                className="bg-cyan-500 text-black px-4 rounded-xl font-bold"
              >
                +
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {teams.map((team, index) => {
                const teamSongs = songs
                  .filter(
                    (song) =>
                      song.team === team
                  )
                  .sort(
                    (a, b) =>
                      Number(a.year) -
                      Number(b.year)
                  )

                return (
                  <div
                    key={index}
                    className="bg-gray-900 p-4 rounded-2xl break-words"
                  >
                    <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                      {team}
                    </h3>

                    <div className="flex gap-2 overflow-x-auto">
                      {teamSongs.map(
                        (
                          song,
                          songIndex
                        ) => (
                          <div
                            key={songIndex}
                            className="bg-gray-800 p-3 rounded-xl min-w-[140px]"
                          >
                            <p className="font-bold text-cyan-300">
                              {song.year}
                            </p>

                            <p>
                              {song.title}
                            </p>

                            <p>
                              {song.artist}
                            </p>

                            <button
                              onClick={() => {
                                const copy = [
                                  ...songs,
                                ]

                                const realIndex =
                                  songs.findIndex(
                                    (s) =>
                                      s.title ===
                                        song.title &&
                                      s.artist ===
                                        song.artist &&
                                      s.year ===
                                        song.year
                                  )

                                copy[
                                  realIndex
                                ].team = ""

                                setSongs(copy)
                              }}
                              className="bg-red-500 mt-3 px-3 py-1 rounded-lg font-bold"
                            >
                              Verwijder
                            </button>
                          </div>
                        )
                      )}

                      {teamSongs.length ===
                        0 && (
                        <p className="text-gray-400">
                          Nog geen kaarten
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}