$(document).ready(async function() {

    //console.log(localStorage.getItem('idUsuario'));
    var id = usuario.recuperarDadosUsuarioId();
    var dadosUsuario = await usuario.recuperaDadosUsuario(id);
    var comentarios = await comentario.recuperaComentariosRecente();
    comentario.carregaComentarios(comentarios.detalhes, '#comentariosRecentes', dadosUsuario);
    //console.log('');
    console.log(comentarios);

    $('#btnEnviar').on('click', async function() {
        try {
            var coment = $('#comentarios').val();
            await comentario.criarComentario(dadosUsuario.username, dadosUsuario.email, coment);
            $('#comentarios').val('');
        } catch (ex) {
            alert('Não foi possível criar o comentário! Por favor, tente mais tarde.')
        }
    })

    $('#btnSair').on('click', function() {
        var confirma = confirm("Tem certeza que deseja deslogar?");

        if (confirma) {
            localStorage.setItem('idUsuario', '');
            location.href = 'index.html';
        }
    })

    $('#btnAllComents').on('click', async function() {
        $('#comentariosMaisRecentes').hide();
        $('#containerTodosComentarios').show();
        var cmt = await comentario.mudarPagina(1, '#todosComentarios', dadosUsuario);
        var qtdPagina = comentario.calculaQtdComentatios(cmt.qtd, 5);
        console.log(qtdPagina);
        comentario.carregaPaginacao(qtdPagina);

        $('.page-item').on('click', async function() {
            var pg = $(this).data('pagina');
            await comentario.mudarPagina(pg, '#todosComentarios', dadosUsuario);
        })
    })


});


var usuario = {
    recuperarDadosUsuarioId: function() {
        var id = localStorage.getItem('idUsuario');

        return { id: id }
    },

    recuperaDadosUsuario: function(idUsuario) {

        return new Promise(function(res, erro) {
            $.ajax({
                url: 'http://localhost:3000/User/recuperaUsuario',
                method: 'POST',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                data: JSON.stringify({
                    id: idUsuario.id
                }),
                success: function(retornoApi) {
                    if (retornoApi.erro == 1) {
                        localStorage.setItem('idUsuario', '');
                        location.href = 'index.html';
                    } else {
                        var dadosUsuario = retornoApi.detalhes;
                        res(dadosUsuario);
                    }
                },
                error: function(erroApi) {
                    alert('Ocorreu um erro ao tentar realizar o login, por favor tente mais tarde.');
                    localStorage.setItem('idUsuario', '');
                    location.href = 'index.html';
                }

            })
        });
    },
};

var comentario = {
    criarComentario: function(username, email, comentario) {
        return new Promise(function(res, erro) {

            $.ajax({
                url: 'http://localhost:3000/Comentarios/cadastrarComentario',
                method: 'POST',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                data: JSON.stringify({
                    username: username,
                    email: email,
                    comentario: comentario
                }),
                success: function(retornoApi) {
                    if (retornoApi.erro == 0) {
                        res(retornoApi);
                    } else
                        erro(retornoApi);
                },
                error: function(erroApi) {
                    erro(erroApi);
                }

            })
        })
    },

    atualizaComentario: function(idComentarioEditado, comentarioEditado) {
        console.log(comentarioEditado);
        $.ajax({
            url: 'http://localhost:3000/Comentarios/atualizarComentario',
            method: 'POST',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            data: JSON.stringify({
                id: idComentarioEditado,
                comentario: comentarioEditado
            }),
            success: function(retornoApi) {
                if (retornoApi.erro == 0) {
                    location.href = 'home.html'
                } else
                    alert('Não foi possível atualizar o comentário, pois o mesmo não foi encontrado!');
            },
            error: function(erroApi) {
                alert('Ocorreu um erro ao tentar realizar a atualização, por favor tente mais tarde.');
            }

        })
    },

    deletarComentario: function(id) {
        return new Promise(function(res, erro) {

            $.ajax({
                url: 'http://localhost:3000/Comentarios/deletarComentario',
                method: 'POST',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                data: JSON.stringify({
                    id: id
                }),
                success: function(retornoApi) {
                    if (retornoApi.erro == 0) {
                        res(retornoApi);
                    } else
                        erro(retornoApi);
                },
                error: function(erroApi) {
                    erro(erroApi);
                }

            })
        })
    },

    recuperaUnicoComentario: function(idComentar) {
        return new Promise(function(res, erro) {
            $.ajax({
                url: 'http://localhost:3000/Comentarios/recuperaUnicoComentario',
                method: 'POST',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                data: JSON.stringify({
                    id: idComentar
                }),
                success: function(retornoApi) {
                    if (retornoApi.erro == 0) {
                        var dadosComentario = retornoApi.detalhes;
                        $('#editarComentarios').val(dadosComentario.comentario);
                    } else
                        erro(retornoApi);
                },
                error: function(erroApi) {
                    erro(erroApi);
                }

            })
        })
    },

    recuperaComentariosRecente: function() {
        return new Promise(function(res, erro) {
            $.ajax({
                url: 'http://localhost:3000/Comentarios/recuperaComentariosRecente',
                method: 'GET',
                crossDomain: true,
                success: function(retornoApi) {
                    if (retornoApi.erro == 0) {
                        res(retornoApi);
                    } else
                        erro(retornoApi);
                },
                error: function(erroApi) {
                    erro(erroApi);
                }

            })
        })
    },

    recuperaTodosComentarios: function(pagina) {
        return new Promise(function(res, erro) {
            $.ajax({
                url: 'http://localhost:3000/Comentarios/recuperaComentariosPaginado/' + pagina,
                method: 'GET',
                crossDomain: true,
                success: function(retornoApi) {
                    if (retornoApi.erro == 0) {
                        res(retornoApi);
                    } else
                        erro(retornoApi);
                },
                error: function(erroApi) {
                    erro(erroApi);
                }

            })
        })
    },

    carregaComentarios: function(comentariosRecentes, idDiv, dadosUsu) {
        var template = '';

        comentariosRecentes.forEach(function(comentar) {
            template =
                `<div class="media text-muted pt-3 comentarioContainer" data-id=${comentar["_id"]}>
                <img data-src="holder.js/32x32?theme=thumb&amp;bg=007bff&amp;fg=007bff&amp;size=1" alt="32x32" class="mr-2 rounded" style="width: 32px; height: 32px;" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_172589030b1%20text%20%7B%20fill%3A%23007bff%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A2pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_172589030b1%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22%23007bff%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2211.5390625%22%20y%3D%2216.9%22%3E32x32%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                                data-holder-rendered="true">
                 <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                   <div class="d-flex justify-content-between align-items-center w-100">
                     <strong class="text-gray-dark">@${comentar.username}</strong>`
            if (dadosUsu.email == comentar.email) {
                template += `
                <div>
                   <a class="excluir" href="#">
                       <svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                           <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                       </svg>
                   </a>
                   <a class="editar" data-toggle="modal" href="#">
                       <svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                           <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                           <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                       </svg>
                   </a>
               </div>`
            }

            template += `</div>
                   <span class="d-block">${comentar.comentario}</span>
                 </div>
            </div>`
            $(idDiv).append(template);

            $('.excluir').off('click').on('click', async function() {
                var idComent = $(this).parents('.comentarioContainer').data('id');
                var confirma = confirm("Deseja realmente excluir o comentário?");
                if (confirma) {
                    await comentario.deletarComentario(idComent);
                }
            })

            $('.editar').off('click').on('click', async function() {
                $('#modalEdicaoComentarios').modal('show');
                var idComent = $(this).parents('.comentarioContainer').data('id');
                comentario.recuperaUnicoComentario(idComent);

                $('#btnSalvaEdicaoComentario').off('click').on('click', async function() {
                    console.log(idComent);
                    var comentEditado = $('#editarComentarios').val();
                    comentario.atualizaComentario(idComent, comentEditado);
                    console.log(comentEditado);
                })
            })
        })

    },

    calculaQtdComentatios: function(qtdTotal, limiteRegistro) {
        return Math.ceil(qtdTotal / limiteRegistro);
    },

    carregaPaginacao: function(qtdPaginas) {
        var template = '';

        for (var i = 1; i <= qtdPaginas; i++) {
            template = `<li data-pagina=${i} class="page-item"><a class="page-link" href="#">${i}</a></li>`
            $('#paginacao').append(template);
        }

    },

    mudarPagina: async function(pgn, idDiv, dadosUsuar) {
        $(idDiv).html('');

        var tdComent = await comentario.recuperaTodosComentarios(pgn);
        comentario.carregaComentarios(tdComent.detalhes, idDiv, dadosUsuar);

        return tdComent;
    }
}