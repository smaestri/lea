$(function() {

    $('.rating-input-emprunt').rating({
        showClear: false,
        showCaption: false
    });

    $('.rating-input-emprunt').on('rating.change', function(event, value) {
        console.log(value);
        $(this).parent().parent().parent().find(".noteSelected-emprunt").val(value);
    });

    $('.rating-input-index').rating({
        disabled: true,
        showClear: false,
        showCaption: false
    });

    $('.rating-input-index').each(function(){
        $(this).rating('update', $(this).attr('data-note'));
    });

    // Ajouter avis
    $(".addAvis").click(function(){

        var actionbouton = $(this);
        var header = $("meta[name='_csrf_header']").attr("content");
        var token = $("meta[name='_csrf']").attr("content");
        $.ajax({
            type: "POST",
            url:  "addAvis/" + $(this).attr("data-book"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({libelle: $(this).parent().parent().find(".avis-emprunt").val(), "note": $(this).parent().parent().find(".noteSelected-emprunt").val()}),
            beforeSend: function(xhr){
                xhr.setRequestHeader(header, token);
            },
            success: function(data) {
                alert('Votre avis a bien  \351t\351 ajout\351, merci!');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status + ": " + thrownError);
            },
             complete: function (xhr, status) {
                actionbouton.attr("disabled", false);
                $('#modal-avis').modal('hide')
             }
        });
    });

    $('#modal-avis').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        var titre = button.data('titre');
        var id = button.data('livre');
        $('.modal-title').html("Ajouter un avis pour " + titre);
        $('#modal-avis').find(".addAvis").eq(0).attr("data-book", id);
    });

});
