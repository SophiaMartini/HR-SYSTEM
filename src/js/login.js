let campoCPF = document.querySelector(".cpf");
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

function logar(){

    


}