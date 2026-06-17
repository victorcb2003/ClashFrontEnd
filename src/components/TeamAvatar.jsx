function getInitials(nom) {
    if (!nom) return '?'
    return nom
        .replace(/^(FC|SC|AS|RC|US|AC)\s/i, '')
        .slice(0, 2)
        .toUpperCase()
}

export default function TeamAvatar({ nom, size = 'sm' }) {
    const sizeClass = size === 'lg' ? 'w-10 h-10 text-base' : 'w-7 h-7 text-xs'
    return (
        <div className={`${sizeClass} rounded-full bg-white/20 border border-white/20 flex items-center justify-center font-medium text-white/90 flex-shrink-0`}>
            {getInitials(nom)}
        </div>
    )
}
