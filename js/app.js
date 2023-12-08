
// ...
var keyPass = '' ;
var questions_available = [];
const letter_up = ["A", "B", "C", "D"];
const baseUrl = 'https://raw.githubusercontent.com/jvsouza/Apriso-Academy/main/json/';
//const baseUrl = 'http://localhost/Apriso-Academy/json/';
const coursesUpdated = {
    "courses_updated":[
        {"file_json":"c_fund_0", "course_unit":"CFND0 - Getting Started"},
        {"file_json":"c_fund_1", "course_unit":"CFND1 - Task and Time"},
        {"file_json":"c_fund_2", "course_unit":"CFND2 - Configuration"},
        {"file_json":"c_fund_3", "course_unit":"CFND3 - Functional Configuration"},
        {"file_json":"c_fund_4", "course_unit":"CFND4 - Best Practices"},
        {"file_json":"c_fund_5", "course_unit":"CFND5 - Design to Build"},

        {"file_json":"c_prof_1", "course_unit":"CPRO1 - Project Lead Management"},
        {"file_json":"c_prof_2", "course_unit":"CPRO2 - Quality Assurance"},
        {"file_json":"c_prof_3", "course_unit":"CPRO3 - Project Methodology"},

        {"file_json":"a_fund_0", "course_unit":"AFND0 - Getting Started"},
        {"file_json":"a_fund_1", "course_unit":"AFND1 - Capabilities"},
        {"file_json":"a_fund_2", "course_unit":"AFND2 - Standard MOM Design Creation"},

        {"file_json":"a_prof_1", "course_unit":"APRO1 - Test Strategy"},
        {"file_json":"a_prof_2", "course_unit":"APRO2 - Bugs and CR Management"},
        {"file_json":"a_prof_3", "course_unit":"APRO3 - Functional Business Requirements & Business Workshops"}

    ]
};

// ...
function decryptText(encryptedText){
    let keyView = $("#encry_key").val();
    let decryptedText = CryptoJS.AES.decrypt(encryptedText, keyView);
    return String(decryptedText.toString(CryptoJS.enc.Utf8));
}

// ...
function createList() {
    let questions = questions_available.questions;
    if ( questions != null ){
        var list = '<ul class="ulTop list-group">';
        var letter = '';
        for (var n=0; n < questions.length ; n++) {
            list += '<li class="liTop list-group-item" data-li="'+n+'">';   
                list += '<ul class="ulMid list-group">';
                    list += '<li class="liMed title list-group-item">';
                        list += '<div class="row">';
                            list += '<div class="col-1 text-center align-items-center justify-content-center d-inline-flex"><label>';
                                list += parseInt(n+1, 10);
                            list += '</label></div>';
                            list += '<div class="col-9">';
                                    list += '<div class="titles_itens">';
                                        list += '<div class="titles_item">';
                                            list += '<div class="bandeira"><img src="img/flag_en.png" /></div>';
                                            list += '<div class="title_text">';
                                                list += decryptText(questions[n].title["en"], keyPass);
                                            list += '</div>';
                                        list += '</div>';
                                        list += '<div class="titles_item traduzir">';
                                            list += '<div class="bandeira"><img src="img/flag_br.png" /></div>';
                                            list += '<div class="title_text">';                                        
                                                list += decryptText(questions[n].title["br"], keyPass);
                                            list += '</div>';
                                        list += '</div>';
                                    list += '</div>';
                            list += '</div>';
                            list += '<div class="col-2">';
                                list += '<button type="button" class="btn btn-outline-primary w-100 h-100" data-question="'+ n +'"></button>';
                            list += '</div>';
                        list += '</div>';
                    list += '<li class="liMed options">';
                        list += '<div class="list-group" data-select="'+n+'">';
                            for (var i = 0; i < questions[n].options["br"].length; i++) {
                                list += '<button type="button" class="list-group-item list-group-item-action button_itens" value="'+ i +'">';
                                    list += '<div class="letter_up">' + letter_up[i] + '</div>';
                                    list += '<div class="questions_itens">';
                                        list += '<div class="question_item"><div class="bandeira"><img src="img/flag_en.png" /></div><div class="question_text">' + decryptText(questions[n].options["en"][i], keyPass) + '</div></div>';
                                        list += '<div class="question_item traduzir"><div class="bandeira"><img src="img/flag_br.png" /></div><div class="question_text">' + decryptText(questions[n].options["br"][i], keyPass) + '</div></div>';                                        
                                    list += '</div>';
                                list += '</button>';
                            }
                        list += '</div>';
                    list += '</li>';
                list += '</ul>';
            list += '</li>';
        }
        list += '</ul>';
        $("#questions").append(list);
    }
}

// ...
function getJson( nameFileJson ) {
    fetch(nameFileJson)
    .then(question_file => {
        return question_file.json(); 
    })
    .then( questions_loaded => {
        questions_available = questions_loaded;
        createList();
    })
    .catch( err => {
        console.log(err);
    })
}

// ...
function createSelect( baseUrl, cu ){
    var options = '<option value="title" selected>Select content</option>';
    for (var n=0; n < cu.courses_updated.length ; n++) {
        jsonUrl = baseUrl + cu.courses_updated[n].file_json + '.json'
        courseUnit = cu.courses_updated[n].course_unit;
        options += '<option value="' + jsonUrl + '">' + courseUnit + '</option>';
    }
     $("#select").append(options);
}

// ...
function checkKeyView(){
    let keyView = $("#encry_key").val();
    keyPass = keyView;
    let textTest = "U2FsdGVkX19cv8qTrbFUdx8+8tRyanlSr/1+QWh9A2A=";
    let decryptedText = CryptoJS.AES.decrypt(textTest, keyView);
    let decryptedString = decryptedText.toString(CryptoJS.enc.Utf8);

    if (decryptedString == "ok") {
        return true
    } else {
        return false
    }
}

// ...
$(document).ready(function(){
    // ...
    $(document).on('click','.btn', function() {
        let questionNumber = $(this).data('question');
        let correctOption = questions_available.questions[questionNumber].result;
        for (var i = 0; i < correctOption.length; i++) {
            $("li[data-li="+questionNumber+"] li.options div button[value="+correctOption[i]+"]").addClass( "optionCorrect" );    
        }
    });

    // ...
    $(document).on("change","#select",function(){
        if (checkKeyView() == true) {
            let nameJson = $(this).val();
            $("#questions").empty();
            if (nameJson != 'title'){
                getJson(nameJson);
            }
        } else {
            let alertMessage = '<div class="alert alert-danger  alert-dismissible fade show text-center" role="alert">Key view <strong>incorrect</strong> !<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
            $("#mensagem").html(alertMessage);
            $("#questions").empty();
        }
    });

    $('#translate').change(function() {
        if ( $('#translate').is(':checked') ) {
            $(".traduzir").addClass("showPtBr");
        } else {
            $(".traduzir").removeClass("showPtBr");
        }
    });

    // ...
    createSelect( baseUrl, coursesUpdated );

});
