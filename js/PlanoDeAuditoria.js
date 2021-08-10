//EXECUTAR AO CARREGAR A PÁGINA
window.onload = function() {

    console.log("--------");
    console.log(getFormMode());
    console.log(getMobile());
    console.log(getWKNumState());
    console.log(getWKUser());
    console.log(getWKNumProces());
    console.log(getWKUserLocale());
    console.log(getWKCardId());
    console.log("--------");
    auditores();
    
};

//CEP Automático
$("#cep_audit").blur(function() {

    $.getJSON("//viacep.com.br/ws/"+ $("#cep_audit").val() +"/json/", function(dados){ 
        
        $("#ende_audit").val(dados.logradouro);
        $("#bairro_audit").val(dados.bairro);
        $("#cidade_audit").val(dados.localidade);
        $("#estado_audit").val(dados.uf);
        
    })
});

$(document).on('change', "#norma_select",
    function normaBusca() {

        var norma = $('#norma_select').val()[0];
        var c1 = DatasetFactory.createConstraint("idenCod", norma, norma, ConstraintType.MUST);
        var constraints = new Array(c1);

        var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeNorma", null, constraints, null);
        
        $('#tipo_doc').val(dataset.values[0].typeDoc);
        $('#id_norma').val(dataset.values[0].idenCod);
        $('#rev_norma').val(dataset.values[0].Revisao);
        $('#desc_norma').val(dataset.values[0].title);
        $('#org_norma').val(dataset.values[0].OrgResp);

    }
);

function auditores() {

    var c1 = DatasetFactory.createConstraint("colleagueGroupPK.groupId", "Auditores", "Auditores", ConstraintType.MUST);
    
    var constraints = new Array(c1);
     
    //Busca o dataset
    var dataset = DatasetFactory.getDataset("colleagueGroup", null, constraints, null);

    var arrayCount = dataset.values.length;

    for (var i = 0; i < arrayCount; i++) {

        var opt = dataset.values[i]["colleagueGroupPK.colleagueId"];

        var c2 = DatasetFactory.createConstraint("login", opt, opt, ConstraintType.MUST);

        var constraint = new Array(c2);
        
        //Busca o dataset
        var data = DatasetFactory.getDataset("colleague", null, constraint, null);

        $('#name_norma').append($('<option>', {

            value: data.values[0].colleagueName,
            text: data.values[0].colleagueName
        }));
    }

    console.log('>>>>');
    console.log(dataset);
    console.log('<<<<');
};