let campoCPF = document.querySelector("#cpf");
let senha = document.querySelector("#senha");


campoCPF.addEventListener("keypress", ()=>{
    let tamanhoCampo = campoCPF.value.length

    if (tamanhoCampo == 3 || tamanhoCampo == 7 ){
        campoCPF.value += ".";
    } else if (tamanhoCampo == 11)
         campoCPF.value += "-"

});

campoCPF.addEventListener("input", function(e){
    this.value = this.value.replace(/[^0-9.-]/g,'');
});


function logar() {
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const lembre = document.getElementById('remember').checked;
    const mensagem = document.getElementById('mensagem');

    if (cpf === '' || senha === '') {
        alert('Preencha todos os campos solicitados.');
        return;
    }

    if (!cpfsValidos.includes(cpf) || cpf.length !== 14 || senha !== senhaCorreta) {
        alert('CPF e/ou senha incorretos.');
        return;
    }        


    if (lembre) {
        localStorage.setItem('cpfLembrado', cpf);
      } else {
        localStorage.removeItem('cpfLembrado');
    }

    window.location.href = 'dashboard.html';
    }

    window.onload = function() {
      const cpfSalvo = localStorage.getItem('cpfLembrado');
      if (cpfSalvo) {
        document.getElementById('cpf').value = cpfSalvo;
        document.getElementById('remember').checked = true;
      }
    };