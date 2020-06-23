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
                    $('#estado').val(dadosUsuario.estado);
                    $('#cidade').val(dadosUsuario.cidade);
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