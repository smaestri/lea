function formatDate(dateToConvert) {
//convert date demande
	let dateStr;
	let dateDemande = new Date(dateToConvert);
	let month = parseInt(dateDemande.getMonth(), 10) + 1;
	dateStr = 'le ' + dateDemande.getDate() + '/' + month + '/' + dateDemande.getFullYear() + ' à ' + dateDemande.getHours() + 'H' + dateDemande.getMinutes();

	return dateStr;
}

export const loanStatus = {
	REQUESTED: "REQUESTED",
	CURRENT: "CURRENT",
	SENT: "SENT"
}

export default formatDate
