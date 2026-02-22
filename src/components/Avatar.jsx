export default function Avatar({ equipe,user, size = "md", className = "" }) {
  const sizes = {
    xs: "h-8 w-8 text-sm",
    sm: "h-12 w-12 text-lg",
    md: "h-16 w-16 text-2xl",
    lg: "h-24 w-24 text-4xl",
    xl: "h-40 w-40 text-6xl",
  }

  const sizeClass = sizes[size] || sizes.md

  

  if (!user && equipe?.img_url) {
    const imageUrl = "https://clashofleagues.fr" + equipe.img_url
    return (
      <img
        src={imageUrl}
        alt={`${equipe?.nom[0] || ""} ${equipe?.nom[1] || ""}`}
        className={`${sizeClass} rounded-full object-cover ${className}`}
      />
    )
  } else if (!user && equipe) {
    const initiales = `${equipe?.nom?.[0] || ""}${equipe?.nom?.[1] || ""}`
    return (
      <div
        className={`${sizeClass} rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center ${className}`}
      >
        {initiales}
      </div>
    )
  }

  const imageUrl = "https://clashofleagues.fr" + user.img_url
  if (user?.img_url) {
    return (
      <img
        src={imageUrl}
        alt={`${user?.prenom[0] || ""} ${user?.nom[0] || ""}`}
        className={`${sizeClass} rounded-full object-cover ${className}`}
      />
    )
  }

  const initiales = `${user?.prenom?.[0] || ""}${user?.nom?.[0] || ""}`

  return (
    <div
      className={`${sizeClass} rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center ${className}`}
    >
      {initiales}
    </div>
  )
}
