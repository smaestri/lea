<div class="modal fade" tabindex="-1" role="dialog" id="modal-emprunt" >
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Demande d'emprunt</h4>
            </div>
            <div class="modal-body">
                <p class="msg-confirmation"></p>
                <div id="bloc-message">
                    <p>Vous pouvez saisir un commentaire pour cet emprunt, &agrave; l'attention du pr&ecirc;teur (par exemple sp&eacute;cifier un cr&eacute;neau horaire et un lieu).</p>
                    <textarea id="txt-rencontre" class="form-control" rows="3"></textarea>
                </div>
                <input type="hidden" id="idProprietaire" />
                <input type="hidden" id="idLivre" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>
                <input class="btn btn-success" type="submit" value="Envoyer"  id="submit-emprunt">
            </div>
        </div>
    </div>
</div>