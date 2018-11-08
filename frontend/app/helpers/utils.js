import React from 'react'

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

export const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

export default formatDate
