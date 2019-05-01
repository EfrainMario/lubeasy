import {ProdutoController} from "./Controller/ProdutoController.js";
//import {Servidor} from "./Model/entidades/Servidor.js";
import {PromocaoController} from "./Controller/PromocaoController.js";
import {PedidosController} from "./Controller/PedidoController.js";
import {LojaController} from "./Controller/LojaController.js";
import {validarTipoDeImagem, jsonReplacer, retirarRodape, colocarRodape, PHPdateTime} from "./Controller/GeralHelper.js";


 
let produtoController = new ProdutoController();
let promocaoController = new PromocaoController();
let pedidosController = new PedidosController();
let lojaController =new LojaController();

/// ------------------------- Index.html -----------------------------------////
// Controlo de sessao

function INTENT(){
    //let url = document.URL;
    //let params = document.location.search;

    let params = new URLSearchParams(document.location.search.substring(1));
    let pagina = params.get("action");
    if(!(pagina===null) || !(pagina === '')){
        modalInserirSenhaParaPaginas(pagina,
            function () {
                $('main').load(pagina + '.html', function () {
                    ler();
                    //$('title').html(pagina.toUpperCase());
                    $('.modal:not(div#modalCredenciaisDeAcesso.modal)').modal();
                    $('.fixed-action-btn').floatingActionButton({hoverEnabled: false});
                });
            });
    }

}

var loja = sessionStorage.getItem('dadosLoja');
if (loja==null){
    location.replace('login.html');
}

loja = JSON.parse(loja);

function modalInserirSenhaParaPaginas(pagina, depoisExecutarFuncao) {
    let executarFuncao = depoisExecutarFuncao;
    let $modal = $('div#modalCredenciaisDeAcesso.modal');
    let Mmodal = M.Modal.init($modal,{onClose: function(){
            console.log('Ops');
            $modal.find('input[name=senhaInserida]').val('');
            executarFuncao = function () {};
        }});
    if((pagina === 'promocao') || (pagina === 'produto' || pagina === 'exibir')) {

        Mmodal[0].open();
        $('form[name=frmInserirSenha]').submit(function (e) {
            e.preventDefault();
            $(e.target).addClass('disabled');
            if (loja.senha === $(this).find('input[name=senhaInserida]').val()) {
                Mmodal[0].close();
                $modal.find('input[name=senhaInserida]').val('');
                executarFuncao();
                executarFuncao = function () {};
            } else {
                M.toast({html: 'Senha Errada.', classes: 'rounded'});
            }
            $('form[name=frmInserirSenha]').unbind('submit');
            $(e.target).removeClass('disabled');
        });

        }else{
        executarFuncao();
        executarFuncao = function () {};
    }
}

//Verificacar a pagina utilizada no momento
function ler(){

    // ------------------------ main.html ----------------------------------- ///

    if($('div#mainPag').length !== 0){
        PaginaMain();
        colocarRodape();
        console.log('main');
    }
    // ------------------------ pedidos.html ----------------------------------- ///
    else if($('div#pedidosPag').length !== 0){
        PaginaPedidos();
        console.log('pedidos');
        colocarRodape();
    }
    // ------------------------ promocao.html ----------------------------------- ///
    else if($('div#promocaoPag').length !== 0){
        PaginaPromocao();
        retirarRodape();
        //Init
        let datePicker = M.Datepicker.init($('input.datepicker'), {
            format: 'yyyy-mm-dd',
            i18n: {
                cancel: 'cancelar',
                clear: 'limpar',
                done: 'ok',
                months:[
                        'Janeiro',
                        'Fevereiro',
                        'Mar;o',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Decembro'
                    ],
                monthsShort:[
                            'Jan',
                            'Fev',
                            'Mar',
                            'Abr',
                            'Mai',
                            'Jun',
                            'Jul',
                            'Ago',
                            'Set',
                            'Out',
                            'Nov',
                            'Dec'
                        ],
                weekdays:[
                    'Domingo',
                    'Segunda-feira',
                    'Terça-feira',
                    'Quarta-feira',
                    'Quinta-feira',
                    'Sexta-feira',
                    'Sábado'
                ],
                weekdaysShort:[
                    'Dom',
                    'Seg',
                    'Ter',
                    'Qua',
                    'Qui',
                    'Sex',
                    'Sab'
                ],
                weekdaysAbbrev:['D','S','T','Q','Q','S','S']
            }
        });
        let timePicker = M.Timepicker.init($('input.timepicker'), {
            twelveHour: false,
            i18n:{
                cancel:'cancelar',
                clear: 'limpar',
                done: 'ok'
            }
        });
        }
    // ------------------------ definicoes.html ----------------------------------- ///
    else if($('div#definicoesPag').length !== 0){
        PaginaDefinicoes();
        colocarRodape();
        console.log('definicoes');
    }
    // ------------------------ produtos.html ----------------------------------- ///
    else if($('div#produtoPag').length !== 0){
        PaginaProduto();
        retirarRodape();
    }// ------------------------ criarConta.html ----------------------------------- ///
    else if($('div#criarContaPag').length !== 0){

    }else{
        console.log('principal');
    }
}


$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();

    $('main#principal').load('main.html', function () {
        $('div#IndexProgressBar').removeClass('active');
        PaginaMain();
    });
    M.AutoInit();

    initSideNavAndNavbar();
    INTENT();
});

function initSideNavAndNavbar() {
//Definindo valores
    $('.sidenav a img.circle').attr('src', loja.logotipo);
    $('.sidenav a span.name').html(loja.nome);
    $('.sidenav a span.email').html(loja.email);
    $('header div#onlineProgressBar').addClass('hide');
    $('header label#onlineCkb').removeClass('hide');
    $('header input[name=ckbOnline]').attr('checked', Boolean(Number(loja.online)));
}
if (Boolean(Number(loja.online)) === false) {
    $('header div.barraVermelha').removeClass('hide');
}
$('header .sidenav li a').bind('click', function (e) {
    $('header .sidenav').sidenav('close');
    let pbIndex = $('div#IndexProgressBar');
    pbIndex.addClass('active');


    loja = JSON.parse(sessionStorage['dadosLoja']);
    initSideNavAndNavbar();

    e.preventDefault();

    let pagina = $(this).attr("href").replace("#", "");

    if(pagina == null){

    }else if(pagina === "modalSair"){

    }else {
        modalInserirSenhaParaPaginas(pagina,
            function () {
                $('main').load(pagina + '.html', function () {
                    ler();
                    $('title').html(pagina.toUpperCase());
                    $('.modal:not(div#modalCredenciaisDeAcesso.modal)').modal();
                    $('.fixed-action-btn').floatingActionButton({hoverEnabled: false});
                });
            });

    }
    pbIndex.removeClass('active');

});
//Sair
$('div#modalSair a#btnSair').click(function (e) {
    e.preventDefault();
    //Todo Desactivar o estado Online
    sessionStorage.removeItem('dadosLoja');
    location.replace('login.html');
});

//--- Online/Offline --------//
$('header input[name=ckbOnline]').bind('click', function (e) {
    //Todo Online Offline

    lojaController.actualizarLoja({ id: loja.id, online: Boolean(e.target.checked)})
        .done(function () {
            M.toast({html: 'Alterado', classes: 'rounded'});
            $('header div.barraVermelha').toggleClass('hide');
    })
        .fail(function (){
            $('header input[name=ckbOnline]').prop('checked', Boolean(Number(loja.online))) ;
        });
    //console.log('online: ', e.target.checked);
});

// ------------------------ main.html ----------------------------------- ///
function PaginaMain() {
    $('#mainPag img#logotipo').attr('src', loja.logotipo);
    $('#mainPag b#txtNomeLoja').html(loja.nome);
    $('#mainPag div#txtCategoriaLoja').html(loja.categoria);
    $('#mainPag div#txtEmailLoja').html(loja.email);
    $('#mainPag b#txtLocalDeReferencia').html(loja.localDeReferencia);
    $('#mainPag p#txtObjectivo').html(loja.objectivo);
    $('#mainPag p#txtHorario').html(loja.horario);
    $('#mainPag p#txtTelefone').html(loja.telefone);
    $('#mainPag p#txtTaxaDeEntrega').html(loja.taxaDeEntrega);


    $('#mainPag input#txtPayMoney').prop('checked',Boolean(Number(loja.payMoney)));
    $('#mainPag input#txtPayOnline').prop('checked',Boolean(Number(loja.payOnline)));
    $('#mainPag input#txtPayTPA').prop('checked',Boolean(Number(loja.payTPA)));

    $('#mainPag input#txtTypeService').prop('checked',Boolean(Number(loja.typeService)));
    //Avaliacoes
    lojaController.obterAvaliacaoMediaLoja(loja).done(function (data, textStaus, xhr) {
        if(xhr.status === 200){
            $('#mainPag span#txtAvaliacaoMedia').html(data);
        }else{
            $('#mainPag span#txtAvaliacaoMedia').parents('div.grey').addClass('hide');
        }
    });

    //---------------  Chart.js -----------------//
    let $context = $('#mainPag canvas#graphEstatisticas');



    let grafico = new Chart($context,
        {// The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data:{
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: " ",
                        backgroundColor: 'rgba(251, 160, 0, 0.8)',
                        borderColor: 'rgba(251, 160, 0, 0.8)',
                        data: [0, 10, 5, 2, 20, 30, 45],
                    }]
            },

        // Configuration options go here
        options:
            {
                title: {
                    display: true,
                    text: 'EVOLUÇÃO DAS VENDAS'
                }
            }

        });
}
// ------------------------ main.html ----------------------------------- ///


// ------------------------- Produto.html ------------------------------- //
function PaginaProduto() {

    produtoController.obterProdutosDaLoja(loja);

    $('form[name=frmAdidionarProduto]').submit(function (e) {
        e.preventDefault();
        $(e.target).addClass('disabled');
        //Todo Verificacao dos campos
        let img = $(this).find('input[name=imagem]')[0].files[0];

        if(validarTipoDeImagem(img)){
            let formData = new FormData();



            formData.append('imagem', img);
            formData.append('json', JSON.stringify({
                nome: $('input[name=nome]').val(),
                categoria: $('select[name=categoria]').val(),
                descricao: $('textarea[name=descricao]').val(),
                tempoDePreparo: $('input[name=tempoDePreparo]').val(),
                preco: $('input[name=preco]').val(),
            }, jsonReplacer));

            produtoController.criarProduto(loja,formData);
            //TODO Upload de ficheiros com JQuery

        }else {
            M.toast({html: 'Erro ao tentar guardar. Verifique se o ficheiro que seleccionou é uma imagem.', classes: 'rounded'});

        }
        $(e.target).removeClass('disabled');


    });

    $('select').formSelect();

}
// ------------------------- Promocao.html ------------------------------- //
function PaginaPromocao() {
    promocaoController.obterTodasAsDaPromocoesLoja(loja);
    $('form[name=frmAdidionarPromocao]').submit(function (e) {
        e.preventDefault();
        $(e.target).addClass('disabled');


        let img = $(this).find('input[name=imagem]')[0].files[0];

        if(validarTipoDeImagem(img)){
            let formData = new FormData();
            formData.append('imagem', img);

            //Todo verificar dados do formulario
            formData.append('json', JSON.stringify({
                nome: $('input[name=nome]').val(),
                descricao: $('textarea[name=descricao]').val(),
                tempoDePreparo: $('input[name=tempoDePreparo]').val(),
                preco: $('input[name=preco]').val(),
                dataTermino: $('input[name=dataTermino]').val()+' '+$('input[name=horaTermino]').val()

            }, jsonReplacer));

            promocaoController.criarPromocao(loja,formData);

        }else {
            M.toast({html: 'Erro ao tentar guardar. Verifique se o ficheiro que seleccionou é uma imagem.', classes: 'rounded'});

        }
        $(e.target).removeClass('disabled');

    });
}

// ------------------------- Definicoes.html ----------------------------- //
function PaginaDefinicoes() {

    $(document).ready(function(){

        $('select').formSelect();

        $("input[name=nome]").val(loja.nome);
        $("input[name=localDeReferencia]").val(loja.localDeReferencia);
        $("input[name=horario]").val(loja.horario);
        $("input[name=telefone]").val(loja.telefone);
        $("input[name=slogan]").val(loja.slogan);
        $("input[name=taxaDeEntrega]").val(loja.taxaDeEntrega);
        $("input[name=objectivo]").val(loja.objectivo);

        $("input[name=payMoney]").prop('checked', Boolean(Number(loja.payMoney)));
        $("input[name=payOnline]").prop('checked', Boolean(Number(loja.payOnline)));
        $("input[name=payTPA]").prop('checked', Boolean(Number(loja.payTPA)));
        $("input[name=typeService]").prop('checked', Boolean(Number(loja.typeService)));

        //let $a = $("select[name=categoria]").find('option:contains("pizaria")');
    });
        $("select[name=categoria]").find(`option[value|='${loja.categoria}']`).attr('selected', 'true');
        $("select[name=provincia]").find(`option[value|='${loja.provincia}']`).attr('selected', 'true');
        $("select[name=municipio]").find(`option[value|='${loja.municipio}']`).attr('selected', 'true');


//aLTERAR SENHA
    $('button#btnAlterarSenha').click(function (e) {
        e.preventDefault();
        modalInserirSenhaParaPaginas('exibir', function () {
            $('div#modalSenha.modal').modal('open');
        });
    });

    $('form[name=frmNovaSenha]').submit(function (e) {
        e.preventDefault();
        let senhaActual = $('input[name=novaSenha]').val();
        //Todo Verificar os campos
        //TODO Funcao Verificadora de Senha
        if(senhaActual === $('input[name=confirmarNovaSenha]').val()){
            lojaController.actualizarLoja({id: loja.id, senha: senhaActual, email:loja.email}).done(function (){
                lojaController.obterLojaPeloId(loja).done(function (data, textStatus, xhr) {
                    sessionStorage['dadosLoja'] = xhr.responseText;
                    loja=data;
                    M.toast({html: 'Já configuramos', classes: 'rounded'});
                });
                M.toast({html: 'Senha Alterada. Aguarde um pouco estamos a configuará-la', classes: 'rounded'});
                $('div#modalSenha.modal').modal('close');
            });
        }else {
            M.toast({html: 'As senhas escritas são diferentes!', classes: 'rounded'});
        }
    });


    //Editar loja
    let lojaDasDefinicoes = {id:loja.id};
    $("input[name=nome]").change(function () {
        lojaDasDefinicoes.nome = $("input[name=nome]").val();
    });
    $("input[name=localDeReferencia]").change(function () {
        lojaDasDefinicoes.localDeReferencia = $("input[name=localDeReferencia]").val();
    });
    $("input[name=horario]").change(function () {
        lojaDasDefinicoes.horario = $("input[name=horario]").val();
    });
    $("input[name=telefone]").change(function () {
        lojaDasDefinicoes.telefone = $("input[name=telefone]").val();
    });
    $("input[name=objectivo]").change(function () {
        lojaDasDefinicoes.objectivo = $("input[name=objectivo]").val();
    });
    $("select[name=provincia]").change(function () {
        lojaDasDefinicoes.provincia = $("select[name=provincia]").val();
    });
    $("select[name=municipio]").change(function () {
            lojaDasDefinicoes.municipio = $("select[name=municipio]").val();
        });
    $("select[name=categoria]").change(function () {
            lojaDasDefinicoes.categoria = $("select[name=categoria]").val();
        });
    $("input[name=payOnline]").change(function () {
            lojaDasDefinicoes.payOnline = $("input[name=payOnline]").val();
        });
    $("input[name=payMoney]").change(function () {
            lojaDasDefinicoes.payMoney = $("input[name=payMoney]").val();
        });
    $("input[name=payTPA]").change(function () {
            lojaDasDefinicoes.payTPA = $("input[name=payTPA]").val();
        });
    $("input[name=taxaDeEntrega]").change(function () {
            lojaDasDefinicoes.taxaDeEntrega = $("input[name=taxaDeEntrega]").val();
        });
    $("input[name=typeService]").change(function () {
        console.log('ashj');
            lojaDasDefinicoes.typeService = $("input[name=typeService]")[0].checked;
        });

    $('form[name=formEditarLoja]').submit(function (e) {
        e.preventDefault();
        modalInserirSenhaParaPaginas('exibir', function () {
            //Todo Verificar os campos
            lojaController.actualizarLoja(lojaDasDefinicoes).done(function () {
                lojaController.obterLojaPeloId(loja).done(function (data, statusText,xhr) {
                    sessionStorage['dadosLoja'] = xhr.responseText;
                    loja = data;
                    initSideNavAndNavbar();
                    M.toast({html: 'Já configuramos.', classes: 'rounded'});
                });
                M.toast({html: 'Os dados foram guardados. Aguarde um pouco. Estamos à configurar.', classes: 'rounded'});
            });
        });


    });


    //Alterar logotipo
    $('input[name=imagemLogotipoLoja]').change(function () {
        console.log('yhayhayah');
        if(validarTipoDeImagem($(this)[0].files[0])){
            $('form[name=formEditarLogotipoLoja]').find('button[type=submit]').removeClass('disabled');
        }else{
            M.toast({html: 'Erro ao tentar guardar. Verifique se o ficheiro que seleccionou é uma imagem.', classes: 'rounded'});
            $('form[name=formEditarLogotipoLoja]').find('button[type=submit]').addClass('disabled');
        }
    });
    $('form[name=formEditarLogotipoLoja]').submit(function (e) {
        e.preventDefault();
        modalInserirSenhaParaPaginas('exibir', function () {
            let imagem = $('form[name=formEditarLogotipoLoja]').find('input[name=imagemLogotipoLoja]')[0].files[0];
            if(validarTipoDeImagem(imagem)){
                let formData = new FormData();
                formData.append('logotipo', imagem);
                //Todo Analisar Melhor
                lojaController.actualizarLogo({id: loja.id}, formData)
                    .done(function () {
                        M.toast({html: 'Logotipo guardado. Aguarde um pouco. Estamos a configurar', classes: 'rounded'});
                        lojaController.obterLojaPeloId(loja).done(function (data, statusText, xhr) {
                            sessionStorage['dadosLoja']= xhr.responseText;
                            loja=data;
                            initSideNavAndNavbar();
                            M.toast({html: 'Está configurado', classes: 'rounded'});
                        });
                    });
            }else {
                M.toast({html: 'Erro ao tentar guardar. Verifique se o ficheiro que seleccionou é uma imagem.', classes: 'rounded'});

            }
        });

    });

    //Todo Verificando A Imagem
}

// ------------------------- CriarConta.html --------------------------------- //
function PaginaCriarConta() {
    
}


function PaginaPedidos() {
    $(document).ready(function () {
        pedidosController.obterPedidosDaLoja(loja, `dataDeEmissao=${PHPdateTime('Y-m-d')}`);
    });
    $(' a.btn-openSidenav').click(function (e) {
       // $('ul.sidenav2').sidenav()[0].M_Sidenav.isOpen = true;
        //console.log('Iniciou> ', $('ul.sidenav2').sidenav('isOpen'));

    });


    $('div#pedidoContainer button#btnAceitarPedido').click(function () {
        console.log('asd');
        $(this).disabled = true;
        let id = $('div#pedidosPag ul.sidenav2 li.orange.lighten-4 span.i').text();
        pedidosController.actualizarPedido(loja,{id: id, isAccept:2})
            .done(function () {
                pedidosController.obterPedidosDaLoja(loja);

            });
    });

    $('form[name=frmNegarPedido]').submit(function (e) {
        e.preventDefault();
        let id = $('div#pedidosPag ul.sidenav2 li.orange.lighten-4 span.i').text();
        let texto = $(this).find('textarea[name=txtNegarPedido]').val();
        pedidosController.actualizarPedido(loja,{id: id, isNotAcceptDetail: texto, isAccept:0})
            .done(function () {
                pedidosController.obterPedidosDaLoja(loja);
            });
    });


}







// ------------------------- Firebase Cloud Messaging FCM --------------------------------- //

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBB1_kiiIbtMbR5s5CcsgYtGwk6JK0PwI4",
    authDomain: "lubssy-818a4.firebaseapp.com",
    databaseURL: "https://lubssy-818a4.firebaseio.com",
    projectId: "lubssy-818a4",
    storageBucket: "lubssy-818a4.appspot.com",
    messagingSenderId: "1020319819161"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.usePublicVapidKey("BA0lvW08D6OwBg9QL-sTfVqp-ZCiu3jvzVGTkfA3nHhsEvz4DS09fUeGS8elQfHBNetvH__M5Kbct83WwZQhGRY");


messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
    getToken();
}).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
});


function getToken(){
    messaging.getToken().then(function(currentToken) {
        if (currentToken) {
            //Todo Guardar o token na base de dados
            lojaController.actualizarLoja({ id: loja.id, fcmToken: currentToken });
            console.log('token: ', currentToken);
        } else {
            console.log('No Instance ID token available. Request permission to generate one.');
        }
    }).catch(function(err) {
        console.log('An error occurred while retrieving token. ', err);
    });
}


messaging.onTokenRefresh(function() {
    getToken();
});

messaging.onMessage(function(payload) {
    let notification = new Notification(payload.notification.title, {body:payload.notification.body,icon:payload.notification.icon});
    notification.onclick = function (){
        window.open(payload.notification.click_action);
    };
    INTENT();
    console.log('Message received. ', payload);
});
