/*
Descricao: Projeto integrador - Blog de Conteúdo sobre games
nome_arquivo: main.js
nome_exercicio: Aula 13 - Elementos Avançados de Formulário
nome_aluno: Nicolas Safra Gazige
email_aluno: nicolas.gazige@aluno.cps.sp.gov.br
turma: WEBI-ISW028-A
*/

// ===== Funções que as duas páginas usam =====
function mostrarErro(campo, elementoErro, texto) {
    campo.classList.add("invalido");
    elementoErro.textContent = texto;
}

function limparErro(campo, elementoErro) {
    campo.classList.remove("invalido");
    elementoErro.textContent = "";
}

// ===== localStorage: guarda dados no navegador =====
// Os dados ficam só neste navegador (não vão para nenhum servidor).
// JSON.stringify transforma o objeto em texto; JSON.parse faz o caminho de volta.
function salvarDados(chave, dados) {
    try {
        localStorage.setItem(chave, JSON.stringify(dados));
        return true;
    } catch (e) {
        return false; // navegador bloqueou o armazenamento
    }
}

function lerDados(chave) {
    try {
        const texto = localStorage.getItem(chave);
        return texto ? JSON.parse(texto) : null;
    } catch (e) {
        return null;
    }
}

function apagarDados(chave) {
    try {
        localStorage.removeItem(chave);
    } catch (e) {
        // nada a fazer
    }
}

// ===== Página de cadastro =====
const formCadastro = document.getElementById("formCadastro");

// Só roda se o formulário existir na página
if (formCadastro) {
    formCadastro.addEventListener("submit", function (evento) {
        evento.preventDefault(); // impede o envio enquanto validamos

        const nome = document.getElementById("nome");
        const email = document.getElementById("email");
        const senha = document.getElementById("senha");
        const confirma = document.getElementById("confirmaSenha");
        const termos = document.getElementById("termos");
        const mensagem = document.getElementById("mensagem");

        let valido = true;
        mensagem.textContent = "";

        // Nome: pelo menos 3 letras
        if (nome.value.trim().length < 3) {
            mostrarErro(nome, document.getElementById("erroNome"), "Digite seu nome (mínimo 3 letras).");
            valido = false;
        } else {
            limparErro(nome, document.getElementById("erroNome"));
        }

        // E-mail
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const erroEmail = document.getElementById("erroEmail");
        if (email.value.trim() === "") {
            mostrarErro(email, erroEmail, "Preencha o e-mail.");
            valido = false;
        } else if (!regexEmail.test(email.value.trim())) {
            mostrarErro(email, erroEmail, "Digite um e-mail válido.");
            valido = false;
        } else {
            limparErro(email, erroEmail);
        }

        // Senha: mínimo 6 caracteres
        const erroSenha = document.getElementById("erroSenha");
        if (senha.value.length < 6) {
            mostrarErro(senha, erroSenha, "A senha deve ter pelo menos 6 caracteres.");
            valido = false;
        } else {
            limparErro(senha, erroSenha);
        }

        // Confirmação: precisa ser igual à senha
        const erroConfirma = document.getElementById("erroConfirma");
        if (confirma.value === "" || confirma.value !== senha.value) {
            mostrarErro(confirma, erroConfirma, "As senhas não são iguais.");
            valido = false;
        } else {
            limparErro(confirma, erroConfirma);
        }

        // Checkbox dos termos: precisa estar marcado
        const erroTermos = document.getElementById("erroTermos");
        if (!termos.checked) {
            erroTermos.textContent = "Você precisa aceitar os termos.";
            valido = false;
        } else {
            erroTermos.textContent = "";
        }

        if (valido) {
            // Salva só nome e e-mail. A senha NÃO é guardada:
            // o localStorage pode ser lido por qualquer um que use o navegador.
            salvarDados("gameOverUsuario", {
                nome: nome.value.trim(),
                email: email.value.trim()
            });
            mensagem.textContent = "Cadastro realizado! Indo para o seu perfil...";
            formCadastro.reset();

            // Espera 1,5 segundo e abre a página de perfil
            setTimeout(function () {
                window.location.href = "perfil.html";
            }, 1500);
        }
    });
}

// ===== Página de perfil =====
const formPerfil = document.getElementById("formPerfil");

if (formPerfil) {
    const bio = document.getElementById("bio");
    const contador = document.getElementById("contador");

    // Contador de caracteres do textarea
    function atualizarContador() {
        contador.textContent = bio.value.length + "/300";
    }
    bio.addEventListener("input", atualizarContador);

    // Saudação com o nome salvo no cadastro
    const usuario = lerDados("gameOverUsuario");
    if (usuario) {
        document.getElementById("saudacao").textContent = "Olá, " + usuario.nome + "!";
    }

    // Se já existe um perfil salvo, preenche o formulário com ele
    const perfilSalvo = lerDados("gameOverPerfil");
    if (perfilSalvo) {
        document.getElementById("apelido").value = perfilSalvo.apelido;
        document.getElementById("plataforma").value = perfilSalvo.plataforma;
        bio.value = perfilSalvo.bio;

        // Radio: marca o que tem o mesmo value
        const radio = document.querySelector('input[name="tipo"][value="' + perfilSalvo.tipo + '"]');
        if (radio) radio.checked = true;

        // Checkbox: marca todos os gêneros que estão na lista salva
        document.querySelectorAll('input[name="generos"]').forEach(function (caixa) {
            caixa.checked = perfilSalvo.generos.includes(caixa.value);
        });

        atualizarContador();
        document.getElementById("mensagem").textContent = "Perfil carregado.";
    }

    // Botão de apagar o perfil salvo
    document.getElementById("apagarPerfil").addEventListener("click", function () {
        apagarDados("gameOverPerfil");
        formPerfil.reset();
        atualizarContador();
        document.getElementById("mensagem").textContent = "Perfil apagado.";
    });

    formPerfil.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const apelido = document.getElementById("apelido");
        const plataforma = document.getElementById("plataforma");
        const mensagem = document.getElementById("mensagem");

        let valido = true;
        mensagem.textContent = "";

        // Texto: apelido obrigatório
        const erroApelido = document.getElementById("erroApelido");
        if (apelido.value.trim() === "") {
            mostrarErro(apelido, erroApelido, "Escolha um apelido.");
            valido = false;
        } else {
            limparErro(apelido, erroApelido);
        }

        // Radio: verifica se algum foi marcado
        const tipoMarcado = document.querySelector('input[name="tipo"]:checked');
        const grupoTipo = document.getElementById("erroTipo").parentElement;
        if (!tipoMarcado) {
            mostrarErro(grupoTipo, document.getElementById("erroTipo"), "Escolha uma opção.");
            valido = false;
        } else {
            limparErro(grupoTipo, document.getElementById("erroTipo"));
        }

        // Select: o valor vazio é o "-- Selecione --"
        const erroPlataforma = document.getElementById("erroPlataforma");
        if (plataforma.value === "") {
            mostrarErro(plataforma, erroPlataforma, "Selecione uma plataforma.");
            valido = false;
        } else {
            limparErro(plataforma, erroPlataforma);
        }

        // Checkbox: conta quantos foram marcados
        const generosMarcados = document.querySelectorAll('input[name="generos"]:checked');
        const grupoGeneros = document.getElementById("erroGeneros").parentElement;
        if (generosMarcados.length === 0) {
            mostrarErro(grupoGeneros, document.getElementById("erroGeneros"), "Marque pelo menos um gênero.");
            valido = false;
        } else {
            limparErro(grupoGeneros, document.getElementById("erroGeneros"));
        }

        // Textarea: mínimo de 20 caracteres
        const erroBio = document.getElementById("erroBio");
        if (bio.value.trim().length < 20) {
            mostrarErro(bio, erroBio, "Escreva pelo menos 20 caracteres.");
            valido = false;
        } else {
            limparErro(bio, erroBio);
        }

        if (valido) {
            // Junta os valores dos checkboxes marcados numa lista
            const generos = [];
            generosMarcados.forEach(function (caixa) {
                generos.push(caixa.value);
            });

            const salvou = salvarDados("gameOverPerfil", {
                apelido: apelido.value.trim(),
                tipo: tipoMarcado.value,
                plataforma: plataforma.value,
                generos: generos,
                bio: bio.value.trim()
            });

            // O formulário NÃO é limpo: os dados continuam na tela
            mensagem.textContent = salvou
                ? "Perfil salvo, " + apelido.value.trim() + "! Ele continua aqui quando você voltar."
                : "Perfil válido, mas o navegador não deixou salvar.";
        }
    });
}
