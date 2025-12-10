document.addEventListener("DOMContentLoaded", () => {
    const itemsPerPage = 6; // quantidade de itens por página
    const items = Array.from(document.querySelectorAll(".option-item"));
    const paginationContainer = document.getElementById("pagination");
  
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let currentPage = 1;
  
    function showPage(page) {
      items.forEach((item, index) => {
        item.style.display =
          index >= (page - 1) * itemsPerPage && index < page * itemsPerPage
            ? "block"
            : "none";
      });
  
      document.querySelectorAll(".page-number").forEach((btn) =>
        btn.classList.remove("active")
      );
      document.querySelector(`.page-number[data-page="${page}"]`).classList.add("active");
    }
  
    // Cria botões de paginação
    function setupPagination() {
      paginationContainer.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("div");
        pageBtn.classList.add("page-number");
        pageBtn.textContent = i;
        pageBtn.dataset.page = i;
        if (i === currentPage) pageBtn.classList.add("active");
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          showPage(currentPage);
        });
        paginationContainer.appendChild(pageBtn);
      }
    }
  
    setupPagination();
    showPage(currentPage);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const itemsPerPage = 6; // quantidade de itens por página
    const items = Array.from(document.querySelectorAll(".option-item-2"));
    const paginationContainer = document.getElementById("pagination-2");
  
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let currentPage = 1;
  
    function showPage(page) {
      items.forEach((item, index) => {
        item.style.display =
          index >= (page - 1) * itemsPerPage && index < page * itemsPerPage
            ? "block"
            : "none";
      });
  
      document.querySelectorAll(".page-number").forEach((btn) =>
        btn.classList.remove("active")
      );
      document.querySelector(`.page-number[data-page="${page}"]`).classList.add("active");
    }
  
    // Cria botões de paginação
    function setupPagination() {
      paginationContainer.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("div");
        pageBtn.classList.add("page-number");
        pageBtn.textContent = i;
        pageBtn.dataset.page = i;
        if (i === currentPage) pageBtn.classList.add("active");
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          showPage(currentPage);
        });
        paginationContainer.appendChild(pageBtn);
      }
    }
  
    setupPagination();
    showPage(currentPage);
  });