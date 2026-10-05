/*
Descricao: Projeto integrador - Blog de Conteúdo sobre games
nome_arquivo: login.js
nome_exercicio: Aula 12 - Introdução aos Formulários Web (tela de login)
nome_aluno: Nicolas Safra Gazige
email_aluno: nicolas.gazige@aluno.cps.sp.gov.br
turma: WEBI-ISW028-A
*/

// Pegando os elementos do formulário
const form = document.getElementById("formLogin");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const erroEmail = document.getElementById("erroEmail");
const erroSenha = document.getElementById("erroSenha");
const mensagem = document.getElementById("mensagem");
const mostrarSenha = document.getElementById("mostrarSenha");

// Mostrar / esconder a senha
mostrarSenha.addEventListener("change", function () {
    senha.type = mostrarSenha.checked ? "text" : "password";
});

// Validação ao enviar o formulário
form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // impede o envio enquanto validamos

    let valido = true;
    mensagem.textContent = "";

    // Validação do e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {
        mostrarErro(email, erroEmail, "Preencha o e-mail.");
        valido = false;
    } else if (!regexEmail.test(email.value.trim())) {
        mostrarErro(email, erroEmail, "Digite um e-mail válido.");
        valido = false;
    } else {
        limparErro(email, erroEmail);
    }

    // Validação da senha
    if (senha.value === "") {
        mostrarErro(senha, erroSenha, "Preencha a senha.");
        valido = false;
    } else if (senha.value.length < 6) {
        mostrarErro(senha, erroSenha, "A senha deve ter pelo menos 6 caracteres.");
        valido = false;
    } else {
        limparErro(senha, erroSenha);
    }

    // Se estiver tudo certo
    if (valido) {
        mensagem.textContent = "Login realizado com sucesso!";
        form.reset();
    }
});

function mostrarErro(campo, elementoErro, texto) {
    campo.classList.add("invalido");
    elementoErro.textContent = texto;
}

function limparErro(campo, elementoErro) {
    campo.classList.remove("invalido");
    elementoErro.textContent = "";
}
