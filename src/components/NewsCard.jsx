import { useEffect, useState } from "react"

function NewsCard() {

    const [newsList, setNewsList] = useState([])

    useEffect(() => {
        setNewsList([
            { id: 0, image: "/Clashofleague.png", title: "News n°1", description: "Je suis une description. Je suis une description. Je suis une description. Je suis une description. Je suis une description. " },
            { id: 1, image: "/Clashofleague.png", title: "News n°2", description: "Je suis une description. Je suis une description. Je suis une description. Je suis une description. Je suis une description. " }
        ])
    }, [])

     return (
    <div className="backdrop-blur-md bg-black/40 rounded-xl border border-white/10 p-4 shadow-lg text-white">
      <h2 className="text-lg font-semibold mb-4">Actualités</h2>

      <div className="space-y-4">
        {newsList.map((news) => (
          <div key={news.id} className="flex gap-4">
            <img src={news.image} className="w-16 h-16 object-contain" />
            <div>
              <p className="font-semibold">{news.title}</p>
              <p className="text-sm text-white/70">{news.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsCard