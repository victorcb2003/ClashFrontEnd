const formaDate = (date) => {
    const date_obj = {
        an: String(date.getFullYear()),
        mois: String(date.getMonth()+1),
        jour: String(date.getDate()),
        heure: String(date.getHours()),
        minute: String(date.getMinutes()),
        seconde: String(date.getSeconds())
    }

    if (date_obj.mois.length == 1) {
        date_obj.mois = "0" + date_obj.jour
    }

    if (date_obj.jour.length == 1) {
        date_obj.jour = "0" + date_obj.jour
    }

    if (date_obj.heure.length == 1) {
        date_obj.heure = "0" + date_obj.heure
    }

    if (date_obj.minute.length == 1) {
        date_obj.minute = "0" + date_obj.minute
    }

    if (date_obj.seconde.length == 1) {
        date_obj.seconde = "0"+date_obj.seconde
    }

    const date_heure = `${date_obj.an}-${date_obj.mois}-${date_obj.jour} ${date_obj.heure}:${date_obj.minute}:${date_obj.seconde}`
    return date_heure
}

export default formaDate;