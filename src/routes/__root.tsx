import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useState, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playlist = ['/music/xmas-1.mp3', '/music/xmas-2.mp3']

  useEffect(() => {
    // Generate snowflakes
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2, // 2-5s
      delay: Math.random() * 5,
    }))
    setSnowflakes(flakes)

    // Attempt auto-play on mount
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.4
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((e) => {
              console.log("Autoplay blocked:", e)
              setIsPlaying(false)
            })
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTrackEnd = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length)
  }

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(console.error)
    }
  }, [currentTrack])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-x-hidden px-4">
      {/* Audio Player */}
      <audio
        ref={audioRef}
        src={playlist[currentTrack]}
        onEnded={handleTrackEnd}
      />

      {/* Music Control */}
      {/* Music Control */}
      {/* Music Control */}
      <button
        onClick={togglePlay}
        className="fixed top-3 right-3 md:top-6 md:right-6 z-50 group flex items-center gap-2 md:gap-3 transition-all duration-300"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        <span className={`hidden md:block bg-white/90 backdrop-blur text-xs font-bold text-[--christmas-red] py-1.5 px-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0 ${isPlaying ? 'opacity-100' : ''}`}>
          {isPlaying ? 'Playing Holiday Tunes 🎵' : 'Play Music'}
        </span>
        <div className={`p-2.5 md:p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-white/30 ${isPlaying
          ? 'bg-linear-to-br from-[--christmas-red] to-red-600 text-white shadow-red-500/30 scale-100 animate-pulse-slow'
          : 'bg-white/80 text-gray-500 hover:bg-white hover:text-[--christmas-red] hover:scale-110'
          }`}>
          {isPlaying ? <Volume2 className="w-5 h-5 md:w-6 md:h-6" /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6" />}
        </div>
      </button>

      {/* Snowflakes */}
      <div className="snow-container">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake text-2xl"
            style={{
              left: `${flake.left}%`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <Outlet />

      <footer className="absolute bottom-4 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Kaiko Inc.
      </footer>

      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  )
}
