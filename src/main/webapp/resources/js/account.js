$(function() {
    <!-- Page mon compte -->
    // Mon profil
    $("#linkProfil").click(function(){
    	event.preventDefault();
        hideCompte();
        $("#contentProfil").show();
        setActive($(this));
    });

    // Mon historique emprunt
    $("#linkHistoriqueEmprunt").click(function(event){
    	event.preventDefault();
        hideCompte();
        $("#contentHistoriqueEmprunt").show();
        setActive($(this));

    });

    // Mon historique pret
    $("#linkHistoriquePret").click(function(event){
    	event.preventDefault();
        hideCompte();
        $("#contentHistoriquePret").show();
        setActive($(this));
    });

    var hideCompte = function() {
        $("#contentProfil").hide();
        $("#contentHistoriqueEmprunt").hide();
        $("#contentHistoriquePret").hide();
    };

    var setActive = function (element){
        $("#menuAccount li").removeClass("active");
        element.parent().addClass("active");
    };

    $("#contentProfil").show();

});
