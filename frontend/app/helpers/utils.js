import React from 'react'
import { SVGInjector } from '@tanem/svg-injector';

function formatDate(dateToConvert) {
//convert date demande
  if(!dateToConvert) {
    return null;
  }
	let dateStr;
	let dateDemande = new Date(dateToConvert);
	let month = parseInt(dateDemande.getMonth(), 10) + 1;
	dateStr = 'le ' + dateDemande.getDate() + '/' + month + '/' + dateDemande.getFullYear() + ' à ' + dateDemande.getHours() + 'H' + dateDemande.getMinutes();

	return dateStr;
}

export function loadSvg () {
  SVGInjector(document.querySelectorAll('[data-inject-svg]'), {
    afterEach(err, svg) {
      if (typeof jarallax === 'function') {
        svg.dispatchEvent(new CustomEvent('injected.mr.SVGInjector', { bubbles: true }));
      }
    },
  });
}

export const loanStatus = {
	REQUESTED: "REQUESTED",
	CURRENT: "CURRENT",
	SENT: "SENT"
}

export const renderHTML = (rawHTML) => React.createElement("div", { className: 'cutLongText', dangerouslySetInnerHTML: { __html: rawHTML } });

export default formatDate
