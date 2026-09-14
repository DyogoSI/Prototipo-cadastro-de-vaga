/*
 * Prototipo estatico (sem Fluig) do fluxo de abertura de vaga.
 * Os dados sao mantidos em localStorage apenas para simular a passagem
 * de informacoes entre as 3 telas durante a apresentacao ao cliente.
 */
(function () {
    "use strict";

    var STORAGE_KEY = "vg_prototipo_vaga";

    function lerDados() {
        try {
            var bruto = window.localStorage.getItem(STORAGE_KEY);
            return bruto ? JSON.parse(bruto) : {};
        } catch (erro) {
            return {};
        }
    }

    function salvarDados(dados) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
        } catch (erro) {
            /* localStorage indisponivel (ex.: modo privado) - ignora no prototipo */
        }
    }

    function atualizarDados(parcial) {
        var atual = lerDados();
        var novo = Object.assign({}, atual, parcial);
        salvarDados(novo);
        return novo;
    }

    window.VagaPrototipo = {
        lerDados: lerDados,
        salvarDados: salvarDados,
        atualizarDados: atualizarDados
    };

    document.addEventListener("DOMContentLoaded", function () {
        inicializarMenuAtivoPorScroll();
        inicializarCardsDeOpcao();
        inicializarChecklist();
        inicializarCamposCondicionais();
    });

    /* Marca no menu lateral a secao visivel no scroll da pagina atual */
    function inicializarMenuAtivoPorScroll() {
        var links = document.querySelectorAll(".vg-sidebar-menu a[href^='#']");
        if (!links.length) return;

        var secoes = [];
        links.forEach(function (link) {
            var alvo = document.querySelector(link.getAttribute("href"));
            if (alvo) secoes.push({ link: link, elemento: alvo });
        });

        function marcarAtivo() {
            var posicaoAtual = window.scrollY + 140;
            var ativa = secoes[0];

            secoes.forEach(function (secao) {
                if (secao.elemento.offsetTop <= posicaoAtual) {
                    ativa = secao;
                }
            });

            links.forEach(function (link) { link.classList.remove("active"); });
            if (ativa) ativa.link.classList.add("active");
        }

        window.addEventListener("scroll", marcarAtivo, { passive: true });
        marcarAtivo();
    }

    /* Cards de opcao (radio estilizado) marcam estado visual ao selecionar */
    function inicializarCardsDeOpcao() {
        document.querySelectorAll(".option-card input[type='radio']").forEach(function (input) {
            input.addEventListener("change", function () {
                var nome = input.name;
                document.querySelectorAll("input[name='" + nome + "']").forEach(function (irmao) {
                    irmao.closest(".option-card").classList.toggle("is-selected", irmao.checked);
                });
            });
        });
    }

    /* Itens de checklist (checkbox em lista) ganham destaque visual quando marcados */
    function inicializarChecklist() {
        document.querySelectorAll(".check-item input[type='checkbox']").forEach(function (input) {
            var item = input.closest(".check-item");
            function atualizar() { item.classList.toggle("is-checked", input.checked); }
            input.addEventListener("change", atualizar);
            atualizar();
        });
    }

    /* Campos que so aparecem conforme outra escolha (ex.: motivo = substituicao) */
    function inicializarCamposCondicionais() {
        document.querySelectorAll("[data-mostrar-se]").forEach(function (bloco) {
            var config = bloco.getAttribute("data-mostrar-se").split("=");
            var nomeCampo = config[0];
            var valorEsperado = config[1];
            var campos = document.querySelectorAll("[name='" + nomeCampo + "']");

            function avaliar() {
                var valorAtual = "";
                campos.forEach(function (campo) {
                    if (campo.type === "radio") {
                        if (campo.checked) valorAtual = campo.value;
                    } else {
                        valorAtual = campo.value;
                    }
                });
                bloco.style.display = valorAtual === valorEsperado ? "" : "none";
            }

            campos.forEach(function (campo) {
                campo.addEventListener("change", avaliar);
            });
            avaliar();
        });
    }
})();
