import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { GoogleGenAI } from "@google/genai"
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Connecting to Neural Net...")
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")

  // Date Check Logic
  const currentDate = new Date()
  // Month is 0-indexed (11 is December). So this is Jan 1, 2026.
  const cutoffDate = new Date(2026, 0, 1)
  const isExpired = currentDate >= cutoffDate

  const loadingMessages = [
    "Connecting to Neural Net...",
    "Parsing Relationship Context...",
    "Compiling Sentiment...",
    "Sprinkling Holiday Magic...",
    "Wrapping your greeting..."
  ]

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    // Auto-select Special Someone for specific names
    const lowerName = newName.toLowerCase()
    if (['deonna', 'angge', 'anguy'].some(n => lowerName.includes(n))) {
      setRelation("Special Someone")
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Special logic for Girlfriend/Special Someone
    const lowerName = name.toLowerCase().trim();
    const isGirlfriend = ['deonna', 'angge', 'anguy'].some(n => lowerName.includes(n)) || relation === "Special Someone";
    const effectiveRelation = isGirlfriend ? "Girlfriend (Special Someone)" : relation;

    // Start loading animation simulation
    let step = 0
    setLoadingText(loadingMessages[0])
    const interval = setInterval(() => {
      step++
      if (step < loadingMessages.length) {
        setLoadingText(loadingMessages[step])
      }
    }, 1500)

    try {
      let generatedMessage = ""
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY

      if (!apiKey) {
        console.warn("No VITE_GEMINI_API_KEY found. Using mock response.")
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 4000))
        if (isGirlfriend) {
          generatedMessage = `Merry Christmas, my love ${name}! You are the best gift I could ever ask for. I love you so much! ❤️`
        } else {
          generatedMessage = `Merry Christmas, ${name}! I'm so grateful to have you as my ${relation}. May your holidays be filled with joy, laughter, and wonderful memories! 🎄`
        }
      } else {
        const ai = new GoogleGenAI({ apiKey });

        // Define prompt context first
        let promptContext = `Write a short, personalized Christmas greeting (max 3 sentences) from Francis (Kaiko) to ${name}, who is his ${effectiveRelation}. `

        if (isGirlfriend) {
          promptContext += `This is for his Girlfriend/Special Someone. The message MUST be deeply romantic, sweet, and special. Express how she is the best gift he received. Make her feel loved and cherished.`
        } else if (effectiveRelation === 'Parents') {
          promptContext += `This is for his mom or dad (Mommy Ann or Daddy Marlon). The message MUST be deeply heartwarming, sincere, sincere, and sentimental. Express immense gratitude for their love, sacrifices, and support. Make it feel very special and loving.`
        } else if (['Barkada', 'Best Friend'].includes(effectiveRelation)) {
          promptContext += `Tone should be fun, casual, and maybe a little funny or "kanal" humor if appropriate for close friends. Make it sound like a real Filipino close friend greeting.`
        } else if (effectiveRelation === 'Crush') {
          promptContext += `Tone should be sweet, cute, and slightly flirty but respectful. Make it memorable.`
        } else {
          promptContext += `Tone should be warm, festive, and appropriate for the relationship (e.g., polite for acquaintances, friendly for family).`
        }

        promptContext += ` Do NOT mention coding, programming, or technology. Focus purely on the holiday spirit, love, and connection.`

        try {
          // Attempt AI Generation
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: promptContext,
          });
          generatedMessage = response.text || "Merry Christmas! (AI decided to take a holiday break, but Francis sends his regards!)"
        } catch (apiError) {
          console.warn("Gemini API Error (likely quota), falling back to template:", apiError)
          // Fallback Logic
          if (isGirlfriend) {
            generatedMessage = `Merry Christmas, my love ${name}! You are the best gift I could ever ask for. I love you so much! ❤️`
          } else {
            generatedMessage = `Merry Christmas, ${name}! I'm so grateful to have you as my ${effectiveRelation}. May your holidays be filled with joy, laughter, and wonderful memories! 🎄`
          }
        }

        // Save to Supabase (Non-blocking)
        try {
          await supabase.from('greetings').insert([
            {
              name: name,
              relation: effectiveRelation,
              message: generatedMessage,
            }
          ])
        } catch (dbError) {
          console.error("Supabase Error:", dbError)
          // Continue flow even if save fails
        }

        // Wait at least for animation loop to look good
        await new Promise(resolve => setTimeout(resolve, 3000))
      }

      clearInterval(interval)
      navigate({
        to: '/greeting',
        search: {
          name,
          message: generatedMessage
        }
      })

    } catch (error) {
      console.error("AI Generation Error:", error)
      clearInterval(interval)
      setIsLoading(false)
      alert("Oops! The elves dropped the server. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Snow and Audio are now handled in __root.tsx */}

      <img
        src="/merry-xmas.png"
        alt="Merry Christmas"
        className="max-w-[85vw] md:max-w-md h-auto drop-shadow-2xl mb-8 hover:scale-105 transition-transform duration-500 ease-in-out"
      />

      <div className="z-10 w-full max-w-md p-6 md:p-10 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 animate-in fade-in zoom-in duration-700 min-h-[400px] flex flex-col justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-(--christmas-green)/20 border-t-(--christmas-red) rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-(--christmas-gold) fill-(--christmas-gold) w-8 h-8 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold text-gray-800 font-['Outfit']">Generating Magic...</h2>
              <p className="text-(--christmas-green) font-medium animate-pulse transition-all duration-300">
                {loadingText}
              </p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2 font-['Outfit'] tracking-tight">
              Merry Christmas! 🎄
            </h1>
            <p className="text-center text-gray-500 mb-8 text-sm font-medium leading-relaxed">
              I automated my Christmas greetings to save time. Enter your details to compile your message.
            </p>

            {isExpired ? (
              <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500 py-8">
                <div className="text-6xl mb-2">👋🎄</div>
                <h2 className="text-2xl font-bold text-gray-800 font-['Outfit'] text-center">See you next Christmas!</h2>
                <p className="text-gray-600 text-center max-w-xs">
                  The holiday season has officially ended. I hope you had a wonderful Christmas and New Year!
                </p>
                <div className="p-4 bg-red-50 text-red-800 rounded-xl text-sm border border-red-100 mt-4">
                  Missed your greeting? Message Francis directly! 📨
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleGenerate}>
                <div className="space-y-1.5 text-left">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 ml-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Juan dela Cruz"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-(--christmas-red) focus:ring-4 focus:ring-(--christmas-red)/5 transition-all outline-none placeholder:text-gray-400 text-gray-900 text-sm"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="relation" className="text-sm font-semibold text-gray-700 ml-1">
                    How do you know Francis?
                  </label>
                  <div className="relative">
                    <select
                      id="relation"
                      name="relation"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-(--christmas-red) focus:ring-4 focus:ring-(--christmas-red)/5 transition-all outline-none appearance-none text-gray-900 text-sm cursor-pointer"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                    >
                      <option value="" disabled>Select your relationship</option>
                      <option value="Special Someone">Special Someone ❤️</option>
                      <option value="Parents">Parents</option>
                      <option value="Family">Family</option>
                      <option value="Best Friend">Best Friend</option>
                      <option value="Barkada">Barkada</option>
                      <option value="Classmate">Classmate</option>
                      <option value="Crush">Crush</option>
                      <option value="Acquaintance">Acquaintance</option>
                      <option value="Stranger">Stranger 😂</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 bg-linear-to-r from-(--christmas-red) to-red-600 text-white font-semibold text-lg rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-px active:translate-y-px transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Generate Greeting</span>
                  <span className="group-hover:rotate-12 transition-transform text-xl">🎁</span>
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}