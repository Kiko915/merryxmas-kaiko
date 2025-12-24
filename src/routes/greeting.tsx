import { createFileRoute, Link } from '@tanstack/react-router'
import { Sparkles, Share2, X, Download, Share as ShareIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

export const Route = createFileRoute('/greeting')({
  component: Greeting,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      name: (search.name as string) || 'Friend',
      message: (search.message as string) || 'Merry Christmas!',
    }
  },
})

function Greeting() {
  const { name, message } = Route.useSearch()
  const storyRef = useRef<HTMLDivElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSaveCard = async () => {
    if (storyRef.current === null) {
      return
    }

    setIsGenerating(true)
    try {
      // Small delay to ensure render
      await new Promise((resolve) => setTimeout(resolve, 100))

      const dataUrl = await toPng(storyRef.current, { cacheBust: true, pixelRatio: 2 })
      setPreviewUrl(dataUrl)
      setShowModal(true)
    } catch (err) {
      console.error('Failed to generate image', err)
      alert("Oops! Could not capture the magic. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!previewUrl) return
    const link = document.createElement('a')
    link.download = `Christmas-Greeting-${name}.png`
    link.href = previewUrl
    link.click()
  }

  const handleShare = async () => {
    if (!previewUrl) return

    // Convert dataUrl to Blob for sharing
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], `Christmas-Greeting-${name}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'Merry Christmas from Francis!',
          text: `Here is a special holiday greeting for ${name}! 🎄`,
          files: [file]
        })
      } else {
        alert("Sharing is not supported on this device/browser. Please download the image instead!")
      }
    } catch (e) {
      console.error("Error sharing", e)
      alert("Could not share automatically. Please download the image.")
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] my-12 w-full max-w-lg mx-auto relative z-10 perspective-1000">

      {/* The Christmas Card (Visible) */}
      <div className="w-full bg-[#fdfbf7] p-2 rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transform transition-transform hover:scale-[1.01] duration-500 ease-out border border-white/20 relative">
        <div className="border-[3px] border-[--christmas-red] rounded-lg p-1">
          <div className="border border-dashed border-[--christmas-gold] rounded-[4px] p-6 md:p-10 flex flex-col items-center text-center relative overflow-hidden">

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[--christmas-red] rounded-tl-lg opacity-20"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[--christmas-red] rounded-tr-lg opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[--christmas-red] rounded-bl-lg opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[--christmas-red] rounded-br-lg opacity-20"></div>

            <div className="mb-6 flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[--christmas-red] font-bold mb-2">Seasons Greetings</span>
              <div className="h-px w-12 bg-[--christmas-gold]/50"></div>
            </div>

            <div className="relative mb-6 group">
              <div className="absolute -inset-1 rounded-full bg-linear-to-br from-[--christmas-gold] via-yellow-200 to-[--christmas-gold] opacity-70 blur-xs group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="/kaiko-christmas.png"
                alt="Francis Christmas Avatar"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md object-cover"
              />
              <Sparkles className="absolute -top-2 -right-2 text-[--christmas-gold] w-6 h-6 animate-pulse" />
            </div>

            <h1 className="font-['Outfit'] text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Dear <span className="text-[--christmas-red]">{name}</span>,
            </h1>

            <div className="relative w-full my-6">
              <span className="absolute -top-4 -left-2 text-6xl text-[--christmas-red]/10 font-serif leading-none">“</span>
              <p className="font-serif italic text-lg md:text-xl text-gray-700 leading-relaxed px-4">
                {message}
              </p>
              <span className="absolute -bottom-8 -right-2 text-6xl text-[--christmas-red]/10 font-serif leading-none rotate-180">“</span>
            </div>

            <div className="mt-4 flex flex-col items-center gap-1">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Warmly,</p>
              <p className="font-['Outfit'] font-bold text-lg text-gray-900">Francis Mistica</p>
            </div>

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 pointer-events-none mix-blend-multiply"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-10 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300 w-full max-w-xs md:max-w-none justify-center">
        <Link
          to="/"
          className="relative px-8 py-3.5 bg-linear-to-b from-[#D42426] to-[#A41315] text-white font-['Outfit'] font-bold rounded-full shadow-[0_10px_20px_-5px_rgba(212,36,38,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(212,36,38,0.5)] hover:-translate-y-0.5 active:translate-y-px transition-all duration-300 flex items-center justify-center gap-2 group border border-red-400/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <span className="tracking-wide">Write Another One</span>
          <span className="group-hover:rotate-12 transition-transform duration-300 text-lg">✨</span>
        </Link>
        <button
          onClick={handleSaveCard}
          disabled={isGenerating}
          className="px-8 py-3.5 bg-white text-[#8B1A1C] font-['Outfit'] font-bold rounded-full shadow-lg hover:bg-[#FFFDF5] border border-[#E5D5C5] hover:border-[#D42426]/30 transition-all duration-300 flex items-center justify-center gap-2 group hover:-translate-y-0.5 active:translate-y-px disabled:opacity-50 disabled:cursor-wait"
        >
          {isGenerating ? (
            <span className="animate-pulse">Wrapping...</span>
          ) : (
            <>
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="tracking-wide">Save Card</span>
            </>
          )}
        </button>
      </div>

      {/* HIDDEN STORY GENERATION CONTAINER (OFF-SCREEN) */}
      {/* This creates a 1080x1920 (9:16) container for High-Quality Story Export */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
        <div ref={storyRef} className="w-[1080px] h-[1920px] bg-linear-to-br from-[#1a472a] via-[#2d5a3f] to-[#0f2b1d] relative flex items-center justify-center p-20 overflow-hidden">

          {/* Festive Background Elements for Story */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          {/* Snowflakes (Simulated with circles for capture stability) */}
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white opacity-40 blur-sm"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
            />
          ))}

          {/* The Card Inside the Story */}
          <div className="w-full scale-125 transform bg-[#fdfbf7] p-8 rounded-3xl shadow-2xl relative">
            {/* Exact copy of inner card logic, but scaled and static for image generation */}
            <div className="border-[6px] border-[--christmas-red] rounded-2xl p-2">
              <div className="border-[3px] border-dashed border-[--christmas-gold] rounded-xl p-16 flex flex-col items-center text-center relative overflow-hidden bg-[#fdfbf7]">
                <div className="mb-10 flex flex-col items-center">
                  <span className="text-xl uppercase tracking-[0.4em] text-[--christmas-red] font-bold mb-4">Seasons Greetings</span>
                  <div className="h-1 w-24 bg-[--christmas-gold]/50"></div>
                </div>
                <div className="relative mb-10">
                  <div className="absolute -inset-2 rounded-full bg-linear-to-br from-[--christmas-gold] via-yellow-200 to-[--christmas-gold] opacity-100"></div>
                  <img src="/kaiko-christmas.png" className="relative w-64 h-64 rounded-full border-8 border-white shadow-lg object-cover" alt="Avatar" />
                </div>
                <h1 className="font-['Outfit'] text-6xl font-bold text-gray-900 mb-6">
                  Dear <span className="text-[--christmas-red]">{name}</span>,
                </h1>
                <div className="relative w-full my-12 px-8">
                  <span className="absolute -top-10 -left-6 text-[8rem] text-[--christmas-red]/10 font-serif leading-none">“</span>
                  <p className="font-serif italic text-4xl text-gray-700 leading-normal">
                    {message}
                  </p>
                  <span className="absolute -bottom-16 -right-6 text-[8rem] text-[--christmas-red]/10 font-serif leading-none rotate-180">“</span>
                </div>
                <div className="mt-8 flex flex-col items-center gap-2">
                  <p className="text-xl uppercase tracking-widest text-gray-400 font-medium">Warmly,</p>
                  <p className="font-['Outfit'] font-bold text-4xl text-gray-900">Francis Mistica</p>
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30 pointer-events-none mix-blend-multiply"></div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 text-white/50 text-3xl font-['Outfit'] tracking-widest uppercase">
            Christmas 2025 🎄 - by Kaiko
          </div>
        </div>
      </div>

      {/* RESULT MODAL */}
      {showModal && previewUrl && (
        <div className="relative z-100" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={() => setShowModal(false)} />

          {/* Scrollable Container */}
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              {/* Modal Panel */}
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all my-8 w-full max-w-sm md:max-w-md p-6 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20">
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Outfit']">Your Holiday Card 📸</h3>
                <p className="text-sm text-gray-500 mb-6 text-center">Ready to share on your Story!</p>

                <div className="w-full aspect-9/16 bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-200 shadow-inner relative group">
                  <img src={previewUrl} alt="Card Preview" className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={handleDownload} className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
                    <ShareIcon className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
