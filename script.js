// ==========================
// CARROSSEL (HOME) - CORRIGIDO DE VERDADE
// ==========================

const track = document.querySelector(".slider-track");

if (track) {
    let originalCards = Array.from(document.querySelectorAll(".card-sabor"));

    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const indicadores = document.querySelector(".indicadores");

    let cardsVisiveis = 3;
    let index = 0;

    function atualizarCardsVisiveis() {
        if (window.innerWidth <= 600) {
            cardsVisiveis = 1;
        } else if (window.innerWidth <= 900) {
            cardsVisiveis = 2;
        } else {
            cardsVisiveis = 3;
        }
    }

    function limparClones() {
        document.querySelectorAll(".card-sabor.clone").forEach(el => el.remove());
    }

    function criarClones() {
        limparClones();

        const inicio = originalCards.slice(-cardsVisiveis).map(c => {
            const clone = c.cloneNode(true);
            clone.classList.add("clone");
            return clone;
        });

        const fim = originalCards.slice(0, cardsVisiveis).map(c => {
            const clone = c.cloneNode(true);
            clone.classList.add("clone");
            return clone;
        });

        inicio.forEach(c => track.prepend(c));
        fim.forEach(c => track.append(c));
    }

    function getCards() {
        return Array.from(document.querySelectorAll(".card-sabor"));
    }

    function larguraCard() {
        return getCards()[0].offsetWidth + 25;
    }

    function mover(anim = true) {
        track.style.transition = anim ? ".5s" : "none";
        track.style.transform = `translateX(-${index * larguraCard()}px)`;
        atualizarDots();
    }

    function criarDots() {
        if (!indicadores) return;

        indicadores.innerHTML = "";

        originalCards.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");

            if (i === 0) dot.classList.add("active");

            dot.addEventListener("click", () => {
                index = i + cardsVisiveis;
                mover();
                reiniciarAuto();
            });

            indicadores.appendChild(dot);
        });
    }

    function atualizarDots() {
        const dots = document.querySelectorAll(".dot");
        if (!dots.length) return;

        let realIndex = (index - cardsVisiveis) % originalCards.length;
        if (realIndex < 0) realIndex += originalCards.length;

        dots.forEach(d => d.classList.remove("active"));
        dots[realIndex]?.classList.add("active");
    }

    function iniciar() {
        atualizarCardsVisiveis();
        criarClones();
        criarDots();

        index = cardsVisiveis;
        mover(false);
    }

    iniciar();

    nextBtn?.addEventListener("click", () => {
        index++;
        mover();
        reiniciarAuto();
    });

    prevBtn?.addEventListener("click", () => {
        index--;
        mover();
        reiniciarAuto();
    });

    track.addEventListener("transitionend", () => {
        const total = originalCards.length;

        if (index >= total + cardsVisiveis) {
            index = cardsVisiveis;
            mover(false);
        }

        if (index < cardsVisiveis) {
            index = total + cardsVisiveis - 1;
            mover(false);
        }
    });

    let auto = setInterval(() => {
        index++;
        mover();
    }, 3000);

    function reiniciarAuto() {
        clearInterval(auto);
        auto = setInterval(() => {
            index++;
            mover();
        }, 3000);
    }

    window.addEventListener("resize", () => {
        iniciar();
    });
}


// clique → produtos
document.querySelectorAll(".card-sabor").forEach(card => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
        const target = card.dataset.target || "todos";
        window.location.href = `produtos.html?filter=${encodeURIComponent(target)}`;
    });
});

// ==========================
// CLIQUE CARROSSEL → PRODUTOS
// ==========================

document.querySelectorAll(".card-sabor").forEach(card => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
        const target = card.dataset.target || "todos";
        window.location.href = `produtos.html?filter=${encodeURIComponent(target)}`;
    });
});


// ==========================
// REVEAL ANIMATION
// ==========================

const reveals = document.querySelectorAll(".reveal");

function revelarElementos() {
    const alturaTela = window.innerHeight;

    reveals.forEach(el => {
        const topo = el.getBoundingClientRect().top;

        if (topo < alturaTela - 120) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revelarElementos);
revelarElementos();


// ==========================
// FILTRO PRODUTOS
// ==========================

const categorias = document.querySelectorAll(".categoria");
const produtos = document.querySelectorAll(".produto");
const titulo = document.querySelector(".titulo-categoria");

const nomesCategorias = {
    todos: "Todos os Produtos",
    pao: "Pães de Queijo",
    bolo: "Bolos Caseiros"
};

function aplicarFiltro(filter, origin = "click") {
    let primeiro = null;

    categorias.forEach(c => {
        c.classList.toggle("active", c.dataset.filter === filter);
    });

    if (titulo) {
        titulo.textContent = nomesCategorias[filter] || "Produtos";
    }

    produtos.forEach(prod => {
        const visivel =
            filter === "todos" || prod.classList.contains(filter);

        prod.style.display = visivel ? "block" : "none";

        if (visivel && !primeiro) primeiro = prod;
    });

    if (primeiro && origin === "nav") {
        requestAnimationFrame(() => {
            primeiro.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            setTimeout(() => {
                primeiro.classList.add("highlight");

                setTimeout(() => {
                    primeiro.classList.remove("highlight");
                }, 1200);
            }, 300);
        });
    }
}

categorias.forEach(cat => {
    cat.addEventListener("click", () => {
        aplicarFiltro(cat.dataset.filter, "click");
    });
});

const params = new URLSearchParams(window.location.search);
const filtroInicial = params.get("filter");

if (filtroInicial) {
    setTimeout(() => {
        aplicarFiltro(filtroInicial, "nav");
    }, 100);
}


// ==========================
// FLIP CARDS
// ==========================

document.querySelectorAll(".card").forEach(card => {
    const btn = card.querySelector(".btn-info");
    const backBtn = card.querySelector(".voltar");

    if (!btn || !backBtn) return;

    btn.addEventListener("click", e => {
        e.stopPropagation();
        card.classList.add("flip");
    });

    backBtn.addEventListener("click", e => {
        e.stopPropagation();
        card.classList.remove("flip");
    });
});