document.addEventListener("DOMContentLoaded", () => {
    const itemsPerPage = 4; 
    const itemsList = document.getElementById("items-list");
    const pagination = document.getElementById("pagination");


    const items = Array.from(itemsList.querySelectorAll(".items"));
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let currentPage = 1;


    function displayItems(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        items.forEach((item, index) => {
            item.style.display = (index >= start && index < end) ? "flex" : "none";
        });
    }

    function setupPagination() {
        pagination.innerHTML = ""; 

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("div");
            pageButton.textContent = i;
            pageButton.classList.add("page-number");

            if (i === currentPage) pageButton.classList.add("active");

            pageButton.addEventListener("click", () => {
                currentPage = i;
                displayItems(currentPage);
                setupPagination();
            });

            pagination.appendChild(pageButton);
        }
    }

    displayItems(currentPage);
    setupPagination();
});
