//EXECUTAR AO CARREGAR A PÁGINA
window.onload = function() {

    auditores();
    cronograma();
    
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

};

//NAVEGAÇÃO DE CADASTRO E PAINEL
function openCadastro() {

    $("#menu_nav").removeClass('active');
    $("#menu_nav").addClass('nav-close');
    $("#cadastro_requisito_nav").removeClass('nav-close');
    $("#cadastro_requisito_nav").addClass('active');

}

function exitCadastro() {

    $("#cadastro_requisito_nav").removeClass('active');
    $("#cadastro_requisito_nav").addClass('nav-close');
    $("#menu_nav").removeClass('nav-close');
    $("#menu_nav").addClass('active');
}

function openPainel() {

    $("#menu_nav").removeClass('active');
    $("#menu_nav").addClass('nav-close');
    $("#painel_nav").removeClass('nav-close');
    $("#painel_nav").addClass('active');

}

function exitPainel() {

    $("#painel_nav").removeClass('active');
    $("#painel_nav").addClass('nav-close');
    $("#menu_nav").removeClass('nav-close');
    $("#menu_nav").addClass('active');
}

//REGISTROS AO PAINEL
var click = 0;
var valid = 0;
var empty = 0;
function cronograma() {

    valid = 0;

    var f_de = $('#f_de').val();
    var f_ate = $('#f_ate').val();
    var f_norma = $('#f_norma').val();
    var f_auditor = $('#f_auditor').val();

    f_de = (f_de.replace('-', '')).replace('-', '');
    f_ate = (f_ate.replace('-', '')).replace('-', '');

    var dataset = DatasetFactory.getDataset("DSFormulariodePlanodeAuditoria", null, null, null);

    var nDts = dataset.values.length;

    for (var i = 0; i < nDts; i++) {

        var dataHrs1 = dataset.values[i].date_planD;
        var dataHrs2 = dataset.values[i].date_planA;

        var dataD = dataHrs1.substring(0, 10);
        var dataA = dataHrs2.substring(0, 10);

        var hrsD = dataHrs1.substring(11, 17);
        var hrsA = dataHrs2.substring(11, 17);

        var dia_closure = dataD.substring(8, 12);
        var mes_closure = dataD.substring(5, 7);
        var ano_closure = dataD.substring(0, 4);

        var param = ano_closure.toString()+mes_closure.toString()+dia_closure.toString();

        var date_closure1 = dia_closure + "/" + mes_closure + "/" + ano_closure;

        var dia_closure = dataA.substring(8, 12);
        var mes_closure = dataA.substring(5, 7);
        var ano_closure = dataA.substring(0, 4);

        var date_closure2 = dia_closure + "/" + mes_closure + "/" + ano_closure;

        
        if (f_de != "" || f_ate != "") {
            if (param >= f_de && param <= f_ate) {
                if (f_norma != "" && f_auditor != "") {
                    if (f_norma == dataset.values[i].id_norma && f_auditor == dataset.values[i].name_norma) {
                        pushTable();
                        valid++;                        
                    }
                }
                else if (f_norma != ""){
                    if (f_norma == dataset.values[i].id_norma) {
                        pushTable();
                        valid++; 
                    }
                }
                else if (f_auditor != "") {
                    if (f_auditor == dataset.values[i].name_norma) {
                        pushTable();
                        valid++; 
                    }
                }
                else {
                    pushTable();
                    valid++;
                }
            }
            
        }
        else {
            if (f_norma != "" && f_auditor != "") {
                if (f_norma == dataset.values[i].id_norma && f_auditor == dataset.values[i].name_norma) {
                    pushTable();
                    valid++;                      
                }
            }
            else if (f_norma != ""){
                if (f_norma == dataset.values[i].id_norma) {
                    pushTable();
                    valid++;
                }
            }
            else if (f_auditor != "") {
                if (f_auditor == dataset.values[i].name_norma) {
                    pushTable();
                    valid++;                  
                }
            }
            else {
                pushTable();
                valid++;
            }
        }
    }

    var tr = $('#tb_planejamento tr');
    console.log(tr);

    console.log(tr.length);
    console.log(valid);
    console.log(empty);

    if (tr.length == 2) {
        vazio();
    }
    else {
        if (empty == 1) {
            $('#div_tb').removeClass('nav-close');
            $('#div_img').addClass('nav-close');
            empty = 0;
        }
    }

    function pushTable() {

        wdkAddChild('tb_planejamento');
        click++;
        var dadoReq = "";

        //Condição de Busca
        var tb_name = "tb_registro";
        var tbdoc = dataset.values[i].id_norma; // Parâmetros dentro da tabela

        //Filtro de Busca 
        var tbConstraint = DatasetFactory.createConstraint("tablename", tb_name, tb_name, ConstraintType.MUST); // Usar sempre tablename
        var docConstraint = DatasetFactory.createConstraint("tb_norma", tbdoc, tbdoc, ConstraintType.MUST); // Nome do campo a uzar como parâmetro
        var arrayConstraint = new Array(tbConstraint, docConstraint); // Tranformas as duas constraint em Array

        // Busca no Dataset + Condições de Filtro
        var array2 = DatasetFactory.getDataset("DSFormulariodeCadastrodeRequisito", null, arrayConstraint, null);

        

        var arrayCount = array2.values.length;

        for (var j = 0; j < arrayCount; j++) {
            dadoReq += array2.values[j].tb_req+'; ';
        }

        $('#tb_data___'+click).val(date_closure1+' - '+date_closure2);
        $('#tb_hrs___'+click).val(hrsD+' - '+hrsA);
        $('#tb_area___'+click).val(dataset.values[i].area_process);
        $('#tb_norma___'+click).val(dataset.values[i].id_norma);
        $('#tb_requisito___'+click).val('...');
        $('#t_tb_requisito___'+click).val(dadoReq);
        $('#tb_auditor___'+click).val('...');
        $('#t_tb_auditor___'+click).val(dataset.values[i].name_norma);
        $('#tb_auditado___'+click).val('...');
        $('#t_tb_auditado___'+click).val(dataset.values[i].org_norma);
    }
        
}

function limpar() {
    var table_tr = $('#tb_planejamento tr');
    
    for (var i = 2; i < table_tr.length; i++) {
        table_tr[i].remove();
    }

    $('#f_de').val("");
    $('#f_ate').val("");
    $('#f_norma').val("");
    $('#f_auditor').val("");

    vazio();
}

function filtrar() {
    var table_tr = $('#tb_planejamento tr');
    
    for (var i = 2; i < table_tr.length; i++) {
        table_tr[i].remove();
    }

    cronograma();

    $('#f_de').val("");
    $('#f_ate').val("");
    $('#f_norma').val("");
    $('#f_auditor').val("");
}

function vazio() {

    $('#div_tb').addClass('nav-close');
    $('#div_img').removeClass('nav-close');
    empty = 1;
    
}

