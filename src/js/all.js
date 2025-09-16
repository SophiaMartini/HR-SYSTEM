$(document).ready(function( ){
    $('#mobile_bt').on('click', function(){
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x')
    });
});