$(function() {
	// Accepter ami
	$(".addFriend").click(function(event) {
		event.preventDefault();
		$('#friend_id').val($(this).attr('data-friend'));
		$('#formRequestedFriend').submit();
	});

	// Supprimer book
	$(".deleteBook").click(function(event) {
		event.preventDefault();
		$('#book_id').val($(this).attr('data-livre'));
		$('#formDeleteBook')[0].submit();
	});

	// liste categorie
	$('.dropdown-menu li a').click(
			function() {
				$('#categorie').val($(this).attr('data-categorie'));
				$('#dropdownMenu1').attr('value',
						$(this).attr('data-categorie-value'));
			});

	// Check if user has friend to search book
	$('#formSearchBook').submit(function() {
		return showAlertFriend();
	});

	$('.contentIndex li a').click(function() {
		return showAlertFriend();
	});

	function showAlertFriend() {
		if ($('#hasFriend').val() != "true") {
			alert("D\351clarez des amis afin de pouvoir rechercher leurs livres!");
			return false;
		}
		return true;
	}

	var updateEmprunt = function(actionEmprunt, empruntId, lien, bouton) {
		var header = $("meta[name='_csrf_header']").attr("content");
		var token = $("meta[name='_csrf']").attr("content");
		// var dataAvis='{"libelle" : "", "note" : ""}';
		// var dataAvis='';
		// var libelleAvis ='';
		var motifRefus = ''

			// Si on a laiss&eacute; un avis poue le livre
			/*
			 * if(actionEmprunt == 'envoyerEmprunt' &&
			 * bouton.parent().find(".avis-emprunt").val() != ''){ dataAvis =
			 * JSON.stringify({libelle: bouton.parent().find(".avis-emprunt").val(),
			 * "note": bouton.parent().find(".noteSelected-emprunt").val()});
			 * libelleAvis = 'Votre avis a bien \351t\351 ajout\351, merci!'; }
			 */
			if (actionEmprunt == 'refuserEmprunt') {
				motifRefus = bouton.parent().parent().find(".motif-refus").val();
			}
		bouton.attr("disabled", true);
		$.ajax({
			type : "POST",
			url : actionEmprunt + "/" + empruntId,
			contentType : "application/json; charset=utf-8",
			data : /* dataAvis + */motifRefus,
			beforeSend : function(xhr) {
				xhr.setRequestHeader(header, token);
			},
			success : function(data) {
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log(xhr.status + ": " + thrownError);
			},
			complete : function(xhr, status) {
				// bouton.attr("disabled", false);
				window.location.href =  lien;
			}

		});
	};

	$('form#addFriendForm').submit(function() {
		$(this).find('input[type=submit]').prop('disabled', true);
	});

	// Ouverture modal Demande d'emprunt
	$('#modal-emprunt')
	.on(
			'show.bs.modal',
			function(e) {
				// hide txt rencontre
				$('#bloc-rencontre').hide();

				var button = $(e.relatedTarget);
				var proprietaire = button.data('proprietaire');
				var livre = button.data('livre');

				var userConnected = $('#userId').val();
				// Si non connecté ou user pas ami
				if (userConnected == null) {
					alert('Veuillez vous connecter ou vous inscrire pour emprunter ce livre.');
					return false;
				}
				
				$('.modal-body #idProprietaire').val(proprietaire);
				$('.modal-body #idLivre').val(livre);

			});

	// Modal refus
	$('#modal-refus').on('show.bs.modal', function(e) {
		var button = $(e.relatedTarget);
		var emprunt = button.data('emprunt');
		$("#refuserEmpruntBtn").attr('data-emprunt', emprunt);

	});

	// Ouverture modal Livre
	$('#modal-livre')
	.on(
			'show.bs.modal',
			function(e) {
				var button = $(e.relatedTarget);
				var livre = button.data('livre');
				$(".modal-body #imageLivre").attr("src", "");
				$('.modal-body #titrelivre').html("");
				$('.modal-body #descLivre').html("");
				$('.modal-body #catLivre').html("");
				$('.modal-body #proprietaireLivre').html("");
				$("#injectAvis").empty();

				$
				.ajax({
					type : "GET",
					url : "livres/" + livre,
					data : "",
					success : function(msg) {
						if (typeof (msg) == 'string') {
							msg = JSON.parse(msg);
						}

						// Sauver proprietaire et livre dans la
						// modal lors de validation
						$('.modal-body #titrelivre').html(
								msg['titreBook']);
						$('.modal-body #descLivre').html(
								msg['description']);
						$('.modal-body #catLivre').html(
								msg['categorie']['libelleCat']);
						$(".modal-body #imageLivre").attr(
								"src", msg['image']);
						$(".modal-body #proprietaireLivre")
						.html(msg.user['fullName']);

						$("#injectAvis").empty();
						// Parcourir avis
						if (msg.avis && msg.avis.length > 0) {
							for (var i = 0; i < msg.avis.length; i++) {
								var htmlAvis = "";
								var avis = msg.avis[i];
								var dateAvis = new Date(
										avis.dateavis);
								var classNote = 'rating-input-livre'
									+ i;
								htmlAvis = htmlAvis
								+ "<input id='"
								+ classNote
								+ "' data-min='0' data-max='5' data-step='1' data-size='xs'><br/>";
								const
								month = parseInt(dateAvis
										.getMonth(), 10) + 1;
								htmlAvis = htmlAvis
								+ avis.auteur.firstName
								+ ' '
								+ avis.auteur.lastName
								+ ' - le '
								+ dateAvis.getDate()
								+ '-'
								+ month
								+ '-'
								+ dateAvis
								.getFullYear()
								+ "<br/>";
								htmlAvis = htmlAvis
								+ avis.libelle;
								$("#injectAvis").append(
										htmlAvis);
								$("#" + classNote)
								.rating(
										'create',
										{
											disabled : true,
											showCaption : false,
											showClear : false,
											size : 'xs'
										});
								$("#" + classNote).rating(
										'update', avis.note);
							}
						}
					},
					error : function(arg1, arg2, arg3) {
						console.log("failure" + arg1 + arg2
								+ arg3);
					}
				});
			});

	// Ouverture modal Echanges
	$('#modal-echange').on('show.bs.modal', function(e) {
		// e.preventDefault();
		var button = $(e.relatedTarget);
		var emprunt = button.data('emprunt');
		$("#ajouterCommentaireBtn").attr('data-emprunt', emprunt);
		callAjaxGetComments(emprunt);

	});

	// Effectuer emprunt
	$("input#submit-emprunt")
	.click(
			function() {
				var header = $("meta[name='_csrf_header']").attr(
				"content");
				var token = $("meta[name='_csrf']").attr("content");
				var userConnected = $('#userId').val();
				if (userConnected == null) {
					alert('Veuillez vous connecter ou vous inscrire pour emprunter ce livre.');
					return false;
				}
				$("input#submit-emprunt").attr("disabled", true);
				$.ajax({
					type : "POST",
					url : "emprunter/",
					data : {
						idLivre : $('.modal-body #idLivre').val(),
						idProprietaire : $(
						'.modal-body #idProprietaire').val(),
						// mode :
						// $('#selectRencontre').children(":selected").text(),
						txtRencontre : $('#txt-rencontre').val()
					},
					beforeSend : function(xhr) {
						xhr.setRequestHeader(header, token);
					},
					success : function(data) {
						window.location.href = "emprunts";
					},
					error : function(xhr, ajaxOptions, thrownError) {
						console.log(xhr.status + ": " + thrownError);
					},
					complete : function(xhr, status) {
						// $("input#submit-emprunt").attr("disabled",
						// false);
					}
				});
			});

	// Accepter Emprunt : redirection pret
	$(".accepterEmpruntBtn").click(function() {
		var empruntId = $(this).attr("data-emprunt");
		updateEmprunt('accepterEmprunt', empruntId, "prets", $(this));
	});

	// Refuser Emprunt : redirection pret
	$("#refuserEmpruntBtn").click(function() {
		var empruntId = $(this).attr("data-emprunt");
		if (!$(this).parent().parent().find(".motif-refus").val()) {
			alert('Veuillez saisir un motif de refus SVP.');
		} else {
			updateEmprunt('refuserEmprunt', empruntId, "prets", $(this));
		}
	});

	// Envoyer Emprunt
	$(".envoyerEmpruntBtn").click(function() {
		var empruntId = $(this).attr("data-emprunt");
		updateEmprunt('envoyerEmprunt', empruntId, "emprunts", $(this));
	});

	// Clore Emprunt
	$(".cloreEmpruntBtn").click(function() {
		var empruntId = $(this).attr("data-emprunt");
		updateEmprunt('cloreEmprunt', empruntId, "prets", $(this));
	});

	// Ajouter commentaire
	$("#ajouterCommentaireBtn").click(function() {
		var button = $(this);
		var empruntId = button.attr("data-emprunt");
		var pageSource = button.attr("data-source");
		this.message = button.parent().parent().find(".commentaire").val();

		if (!this.message) {
			alert('Veuillez saisir un commentaire SVP');
			return;
		}
		$(this).attr("disabled", true);
		var header = $("meta[name='_csrf_header']").attr("content");
		var token = $("meta[name='_csrf']").attr("content");

		$.ajax({
			type : "POST",
			url : "addComment/" + empruntId,
			contentType : "application/json; charset=utf-8",
			data : this.message,
			beforeSend : function(xhr) {
				xhr.setRequestHeader(header, token);
			},
			success : function() {
				// window.location.href = "/" + pageSource;
				// open popin
				button.attr("disabled", false);
				callAjaxGetComments(empruntId);
				button.parent().parent().find(".commentaire").val('');
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log(xhr.status + ": " + thrownError);
			},
			complete : function(xhr, status) {
				$(this).attr("disabled", false);
			}
		});
	});

	/**
	 * generic function to get chat
	 */
	function callAjaxGetComments(emprunt) {

		$.ajax({
			type : "GET",
			url : "echanges?empruntId=" + emprunt,
			data : "",
			success : function(msg) {
				// Sauver proprietaire et livre dans la modal lors de validation

				if (typeof (msg) == 'string') {
					msg = JSON.parse(msg);
				}

				var htmlComment = "";
				$("#injectEchange").empty();

				if (!msg || msg.length <= 0) {
					return;
				}

				// Parcourir echanges
				for (var i = 0; i < msg.length; i++) {
					var comment = msg[i];
					var message = comment.message;
					var user = comment.user.fullName;
					var dateComment = new Date(comment.dateMessage);
					const
					month = parseInt(dateComment.getMonth(), 10) + 1;
					htmlComment = htmlComment + " <b>Le "
					+ dateComment.getDate() + '-' + month + '-'
					+ dateComment.getFullYear() + " par " + user
					+ "</b><br/>";
					htmlComment += comment.message;
					htmlComment += "<br/>"
				}
				$("#injectEchange").append(htmlComment);
			},
			error : function(arg1, arg2, arg3) {
				console.log("failure" + arg1 + arg2 + arg3);
			}
		});
	}
});
