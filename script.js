const TMDB_API_KEY = "737eb3010ef51d596205a3fc02f48e83";

function adicionarFilme() {
  const nome = document.getElementById("nomeFilme").value.trim();
  const descricao = document.getElementById("descricaoFilme").value.trim();
  const nota = document.getElementById("notaFilme").value.trim();

  if (!nome || !descricao || nota === "") {
    alert("Preencha todos os campos.");
    return;
  }

  const novoFilme = { nome, descricao, nota };
  const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
  filmes.push(novoFilme);
  localStorage.setItem("filmes", JSON.stringify(filmes));

  alert("Filme cadastrado com sucesso!");
  document.getElementById("nomeFilme").value = "";
  document.getElementById("descricaoFilme").value = "";
  document.getElementById("notaFilme").value = "";
}

function buscarLocal() {
  const termo = document.getElementById("buscaFilme").value.toLowerCase();
  const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
  const encontrados = filmes.filter(f => f.nome.toLowerCase().includes(termo));
  mostrarResultados(encontrados, "Local");
}

async function buscarTmdb() {
  const termo = document.getElementById("buscaFilme").value.trim();
  if (!termo) {
    alert("Digite um nome para buscar.");
    return;
  }

  try {
    const resposta = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(termo)}`);
    const dados = await resposta.json();
    const filmes = dados.results.map(f => ({
      nome: f.title,
      descricao: f.overview || "Sem descrição.",
      nota: f.vote_average || "N/A"
    }));
    mostrarResultados(filmes, "TMDb");
  } catch (e) {
    alert("Erro ao buscar na TMDb.");
    console.error(e);
  }
}

function mostrarResultados(filmes, origem) {
  const container = document.getElementById("resultadoBusca");
  container.innerHTML = `<h3>Resultados da busca (${origem}):</h3>`;

  if (!filmes.length) {
    container.innerHTML += "<p>Nenhum filme encontrado.</p>";
    return;
  }

  filmes.forEach(filme => {
    const div = document.createElement("div");
    div.className = "filme";
    div.innerHTML = `<strong>${filme.nome}</strong><br><em>Nota:</em> ${filme.nota}<br><p>${filme.descricao}</p>`;
    container.appendChild(div);
  });
}
