document.addEventListener("DOMContentLoaded", () => {

  const target = document.querySelector("header[id^='header-']");
  if (!target) return;

  const headerType = target.id;

  fetch('/src/components/footer-header.html')
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar header");
      return response.text();
    })
    .then(data => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data;

      const selectedHeader = tempDiv.querySelector(`#${headerType}`);
      if (selectedHeader) {
        target.innerHTML = selectedHeader.innerHTML;
      }
    })
    .catch(error => console.error(error));
});


  //tentano arrumar essa bosta de menu mobile
$(document).ready(function( ){
    $('#mobile_bt').on('click', function(){
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x')
    });
});
