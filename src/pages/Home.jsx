import { useNavigate } from "react-router-dom"
import { FaUsers, FaCalendarAlt, FaComments, FaShieldAlt, FaMapMarkerAlt, FaChartBar } from "react-icons/fa"
import Header from "../components/Header.jsx"

function Home() {
  const navigate = useNavigate()

  const scrollToAbout = () => {
    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div>
      <Header />

      <div className="flex min-h-screen relative overflow-hidden">

        <main className="flex-1 relative">
          <section className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-[url('/Football.jpg')] bg-cover bg-center" />
            </div>

            <div className="relative z-10 flex items-center justify-between w-full px-16 min-h-screen bg-black/60">
              <div className="max-w-2xl">
                <span className="inline-block mb-6 px-4 py-1 text-sm font-semibold rounded-full bg-green-600 text-white">
                  SAISON 2026
                </span>

                <h1 className="text-5xl font-extrabold leading-tight mb-6">
                  <span className="text-white">ORGANISEZ VOS</span><br />
                  <span className="text-green-500">TOURNOIS SPORTIFS</span><br />
                  <span className="text-lime-400">COMME UN PRO</span>
                </h1>

                <p className="text-neutral-300 mb-8">
                  Clash of League est une association à but non lucratif qui
                  simplifie la gestion de vos équipes, matchs et compétitions
                  sportives amateurs. 100% gratuit, pour tous.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                  >
                    Rejoindre la communauté →
                  </button>

                  <button
                    onClick={scrollToAbout}
                    className="px-6 py-3 border border-lime-400 text-lime-400 rounded-md hover:bg-lime-400 hover:text-black transition"
                  >
                    En savoir plus
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center w-1/2">
                <img
                  src="/Clashofleague.png"
                  alt="Clash of League"
                  className="max-w-md w-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </section>
          <section id="about-section" className="min-h-screen bg-white flex items-center">
            <div className="flex items-center justify-between w-full px-16">
              <div className="max-w-xl">
                <h2 className="text-4xl font-extrabold mb-6">
                  LE SPORT AMATEUR<br />
                  <span className="text-green-600">MÉRITE MIEUX</span>
                </h2>

                <p className="text-neutral-700 mb-6">
                  Aujourd'hui, de nombreuses compétitions sportives sont encore
                  organisées de manière manuelle avec des tableaux papier,
                  des fichiers Excel ou des groupes de discussion.
                </p>

                <p className="text-neutral-700 mb-10">
                  <span className="font-semibold">Clash of League</span> est une
                  plateforme numérique centralisée permettant l'organisation
                  de tournois sportifs amateurs.
                </p>

                <ul className="space-y-6">
                  {[1, 2].map((n, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-bold">
                        {n}
                      </span>
                      <div>
                        <h4 className="font-semibold">
                          {n === 1 && "Centralisez vos informations"}
                          {n === 2 && "Suivez vos compétitions"}
                        </h4>
                        <p className="text-neutral-600">
                          {n === 1 && "Équipes, matchs, résultats."}
                          {n === 2 && "Classements et stats."}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden lg:flex items-center justify-center w-1/2">
                <img src="/Ballon.jpg" alt="Football" className="w-full h-full object-cover rounded-2xl" />
              </div>
            </div>
          </section>
          <section className="bg-[#f3f7f4] py-24 px-16">
            <div className="text-center mb-16">
              <span className="text-green-600 font-semibold uppercase tracking-widest">
                Fonctionnalités
              </span>
              <h2 className="text-5xl font-extrabold mt-4 mb-4">
                TOUT CE DONT VOUS AVEZ BESOIN
              </h2>
              <p className="text-neutral-600">
                Une plateforme complète pour organiser vos tournois de A à Z.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {[
                { icon: FaUsers, title: "GESTION DES ÉQUIPES" },
                { icon: FaCalendarAlt, title: "ORGANISATION DE MATCHS" },
                { icon: FaShieldAlt, title: "RÔLES ET PERMISSIONS" },
                { icon: FaChartBar, title: "STATISTIQUES ET CLASSEMENTS" },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                    <Icon className="text-green-600 text-3xl mb-4" />
                    <h3 className="font-extrabold text-xl mb-2">{item.title}</h3>
                    <p className="text-neutral-600">
                      Une gestion moderne, claire et centralisée pour vos compétitions sportives.
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
          <section className="relative py-32 px-16 bg-black">
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
              <div className="max-w-xl text-white">
                <h2 className="text-5xl font-extrabold mb-6">
                  PRÊT À ORGANISER VOTRE<br />
                  <span className="text-green-500">PROCHAIN TOURNOI ?</span>
                </h2>

                <p className="text-neutral-300 mb-8">
                  Clash of League est une association à but non lucratif. Rejoignez la
                  communauté et commencez à organiser vos compétitions gratuitement.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                  >
                    Créer mon compte →
                  </button>
                </div>
              </div>
            </div>
          </section>

          <footer className="bg-[#f3f7f4] pb-10 pt-10">
            <div className="text-center text-neutral-500">
              Clash of League — Projet BTS SIO SLAM — William Tousson, Loïck Devismes, Victor Combermorel-Bluntz
            </div>
          </footer>

        </main>
      </div>
    </div>
  )
}

export default Home
