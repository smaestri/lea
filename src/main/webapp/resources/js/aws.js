$(function() {

    $( "#isbn" ).change(function() {
        $('#injectImage').empty();
         $('#titreBook').val('');
         $('#auteur').val('');
         $('#editeur').val('');

       $.ajax({
          type: "GET",
          url: "/getDetailFromAmazon/" + $(this).val(),
          data: "",
          success: function(msg){
             msg = JSON.parse(msg);
              if(!msg || !msg["title"]){
                alert('isbn non trouvé');
                return;
              }

            $('#injectImage').append("<img src=" + msg["image"] + " />");
            $('#titreBook').val(msg["title"] );
            $('#auteur').val(msg["author"] );
            $('#editeur').val(msg["editor"] );
             $('#image').val(msg["image"]);

          },
          error: function(arg1, arg2, arg3){
              console.log("failure" + arg1 + arg2 + arg3);
          }
      });


    });

});