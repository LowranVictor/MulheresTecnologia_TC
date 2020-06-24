$(document).ready(function() {

    console.log(localStorage.getItem('idUsuario'));
    var id = usuario.recuperarDadosUsuarioId();
    usuario.recuperaDadosUsuario(id);

    $('#formAtualizaDadosUsuario').on('submit', function() {
        var dadosCadastro = usuario.recuperaNovosDadosCadastro();

        usuario.atualizaUsuario(dadosCadastro.nome, dadosCadastro.sobrenome,
            dadosCadastro.username, dadosCadastro.sexo, dadosCadastro.email,
            dadosCadastro.pais, dadosCadastro.estado, dadosCadastro.cidade);

        return false;
    });

    $('#btnVoltarHome').on('click', function() {
        var confirma = confirm("Certeza que deseja voltar para Página Inicial?");
        if (confirma)
            location.href = 'home.html'
    });



    $("#estado").on("select2:select", function(e) {
        $("#cidade").select2("destroy");
        $('#cidade').val('').trigger('change')
        usuario.carregaCidades(e.params.data.id);
    });

});


var usuario = {
    recuperarDadosUsuarioId: function() {
        var id = localStorage.getItem('idUsuario');

        return { id: id }
    },

    recuperaDadosUsuario: function(idUsuario) {
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
                    console.log(dadosUsuario);

                    $('#firstName').val(dadosUsuario.nome);
                    $('#lastName').val(dadosUsuario.sobrenome);
                    $('#username').val(dadosUsuario.username);
                    $('#sexo').val(dadosUsuario.sexo);
                    $('#email').val(dadosUsuario.email);
                    $('#pais').val(dadosUsuario.pais);
                    usuario.recuperaEstado(dadosUsuario.estado);
                    usuario.recuperaCidade(dadosUsuario.estado, dadosUsuario.cidade);
                }
            },
            error: function(erroApi) {
                alert('Ocorreu um erro ao tentar realizar o login, por favor tente mais tarde.');
            }

        })
    },

    recuperaNovosDadosCadastro: function() {
        var nome = $('#firstName').val();
        var sobrenome = $('#lastName').val();
        var username = $('#username').val();
        var sexo = $('#sexo').val();
        var email = $('#email').val();
        var pais = $('#pais').val();
        var estado = $('#estado').val();
        var cidade = $('#cidade').val();

        return { nome: nome, sobrenome: sobrenome, username: username, sexo: sexo, email: email, pais: pais, estado: estado, cidade: cidade }

    },

    recuperaEstado: function(valorInicial) {
        var estado = $('#estado')
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/Estados/recuperaEstado',
            success: function(retorno) {
                estado.select2({ minimumResultsForSearch: -1, data: retorno })
                estado.val(valorInicial)
                estado.trigger('change');
            }
        })
    },

    recuperaCidade: function(idEstado, valorInicial) {
        var cidade = $('#cidade')
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/Estados/recuperaCidade/' + idEstado,
            success: function(retorno) {
                cidade.select2({ minimumResultsForSearch: -1, data: retorno.detalhes })
                cidade.val(valorInicial)
                cidade.trigger('change');
            }
        })
    },
    carregaCidades: function(idEstado) {
        $('#cidade').select2({
            minimumResultsForSearch: -1,
            ajax: {
                crossDomain: true,
                url: 'http://localhost:3000/Estados/recuperaCidade/' + idEstado,
                processResults: function(data) {
                    // Transforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: data.detalhes
                    };
                }
            }
        });
    },

    atualizaUsuario: function(nome, sobrenome, username, sexo, email, pais, estado, cidade) {
        $.ajax({
            url: 'http://localhost:3000/User/atualizar',
            method: 'POST',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            data: JSON.stringify({
                nome: nome,
                sobrenome: sobrenome,
                username: username,
                sexo: sexo,
                email: email,
                pais: pais,
                estado: estado,
                cidade: cidade
            }),
            success: function(retornoApi) {
                if (retornoApi.erro == 0) {
                    location.href = 'home.html'
                } else
                    alert('Não foi possível atualizar o usuário, pois o mesmo não foi encontrado!');
            },
            error: function(erroApi) {
                alert('Ocorreu um erro ao tentar realizar a atualização, por favor tente mais tarde.');
            }

        })
    }
};