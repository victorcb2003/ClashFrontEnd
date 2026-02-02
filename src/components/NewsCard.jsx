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
        <>
            {newsList?.map((news) => (
                <div className="px-2" key={news?.id}>
                    <div className="flex justify-center opacity-25">
                        <span className={`my-4 border-2 rounded-full border-orange-700 w-3/5 ${news.id == 0 ? "hidden" : ""}`} />
                    </div>
                    <div className="flex">
                        <img src={`${news?.image}`} alt="imageActus" className="w-32 "/>
                        <div className="flex flex-col p-2">
                            <p className="font-bold pb-1">{news?.title}</p>
                            <p className="text-sm text-gray-800">{news?.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default NewsCard