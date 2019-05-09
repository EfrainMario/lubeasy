import {Servidor} from "./Model/entidades/Servidor.js";
window.name= "lubeasy";
//Controller
class LojaController{
    constructor(){
        this.servidor = new Servidor();
    }

    //email e senha
    login(dados){
        this.servidor.requisitar('GET','/lojas', dados, function () {
            $('div#LoginProgressBar').toggleClass('hide');
            $('button#btnLogin').attr('disabled', 'disabled');
        }, function(data, textStatus, xhr){
            sessionStorage.setItem('dadosLoja', xhr.responseText);
            document.location.replace('index.html');
        }, function () {
            $('span#resposta').html('Email ou senha errada');
        }, function () {
            $('div#LoginProgressBar').toggleClass('hide');
            $('button#btnLogin').prop('disabled', false);
        });
    }

    obterLojaPeloId(id){
        this.servidor.requisitar('GET','/lojas/'+id, null, function () {

        }, function () {

        }, function () {

        });
    }
    criarLoja(loja){
        this.servidor.requisitar('POST','/lojas',loja, function () {

        }, function () {

        }, function () {
            
        });
    }
    actualizarLogo(loja, foto){
        this.servidor.requisitar('POST','/lojas/'+loja.id, foto, function () {

    }, function () {

    }, function () {

    });
    }
    actualizarLoja(loja){
        this.servidor.requisitar('PUT','/lojas/'+loja.id, loja, function () {

        }, function () {

        }, function () {

        });
    }
}

let lojaController = new LojaController();



/// ------------------------ Criar Conta ----------------------------------////
$('form[name=formCriarConta]').submit(function (e){
    e.preventDefault();
    var $btn = $('button[type=submit]');
    $btn.disabled = true;

    //Verificando campos vasios
    // Todo: Verificações no formulário
    var CamposVasios = 0;
    $(this).each(function (indice, elemento) {
        if(elemento.value == null){
            console.log("existem campos vasios: ");
            CamposVasios = 1 ;
        }
    });
    CamposVasios =0 ;
    //Enviando os dados
    var $json = "";
    if(!CamposVasios){
        //TODO: Transformar em JSON
        //TODO: Funcoes de data

        var dateTime = new Date();

        var loja ={
            id: null,
            nome: $('input#nome').val(),
            provicia: $('#provicia').val(),
            municipio: $('#municipiod').val(),
            telefone: $('#telefoned').val(),
            senha: $('#senhad').val(),
            email: $('#emaild').val(),
            NIF: $('#NIFd').val(),
            nomeDono: $('#nomeDonod').val(),
            emailDono: $('#emailDonod').val(),
            telefoneDono: $('#telefoneDonod').val(),
            BIDono: $('#BIDonod').val(),
            endereco: $('#enderecod').val(),
            categoria: $('#categoriad').val(),
            dataDeCriacao: dateTime.getFullYear()+'/'+dateTime.getMonth()+'/'+  new Date().getTime()
        };

        console.log(loja);



        //$('main').load('1useKamba.html');



        $btn.disabled = false;
    }

});
//$('form[name=formLogin]').find('input[name=email]').val('kero@gm.com');
//$('form[name=formLogin]').find('input[name=senha]').val('12345');

//// ------------------------ Login ---------------------------------------////
$('form[name=formLogin]').submit(function(e){
    e.preventDefault();
    let $btnLogin = $('button#btnLogin');
    $btnLogin.disabled = true;
    //Todo Verificacao
    if(($(this).find('input[name=email]').val() === '') || ($(this).find('input[name=senha]').val())=== ''){
        M.toast({html: 'Nenhum dos campos pode ser vasio', classes: 'rounded'});
    }else{
        lojaController.login($(this).serialize());
    }

    $btnLogin.disabled = false;
});

