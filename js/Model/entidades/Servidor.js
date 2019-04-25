class Servidor{
    constructor(){
        //this.host='http://localhost/www/vectis/api/loja/v1/';
        this.host='https://apiloja.herokuapp.com';
    }
    requisitar(metodo, router, dados, loading, success, failure, sempre, comImagem = false){
        console.log('comImagem: ', comImagem);
        return $.ajax(
            {
                crossDomain: true,
                //headers: {  'Access-Control-Allow-Origin': '*' },
                xhrFields :  {
                    withCredentials :  true
                },
                method: metodo,
                url:this.host+router,
                data: dados,
                contentType: comImagem === true? false: "application/json",
                processData: false,
                beforeSend: loading(),
                statusCode: {
                    200:function (data, textStatus, xhr){
                        success(data, textStatus, xhr);
                    },
                    201:function (data, textStatus, xhr){
                        success(data, textStatus, xhr);
                    },
                    204:function (data, textStatus, xhr){
                        success(data, textStatus, xhr);
                    }
                }
            })
            .fail(function() {
                failure();
            })
            .always(function() {
                sempre();
            });
    }
}
export {Servidor};