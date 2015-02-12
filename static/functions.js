//var current_form = -1l
// variable num_of_forms is already set in turk.py
url_base = '/FEC/validation/'; 
url_submit = url_base + 'submit/';  
url_pages = url_base + 'page/'; 

session_id = 0;

function keyboard_lock(){
    $(document).locked = true;
}



function keyboard_unlock(){
    $(document).locked = false;
}


function show_next_form(current_form){
        $(document).unbind('keypress');
        var n = current_form + 1;
        var button_A = $("#button-A-"+n);
        var button_B = $("#button-B-"+n);
        var button_C = $("#button-C-"+n);
        $("._counter").show();
        $("._counter").text((1+n)+'/'+num_of_forms);
        // if current is not the first page, hide the previous page and save the response
        if (n >= 1){
          
            $('#form-'+(n-1)).hide();
        }
        if (n==0)
            $('#form-'+n).fadeIn();
        else
            $('#form-'+n).show();

    if (current_form == num_of_forms-2 ){
        // activate the final form
        $("#button-A-"+n).click(function(){
            if (!$(document).locked){
                keyboard_lock();
                $(document).unbind('keypress');
                save_response("A",n)
                submit_form();
                keyboard_unlock();
            }
        });
        $("#button-B-"+n).click(function(){
            if (!$(document).locked){
                keyboard_lock();
                $(document).unbind('keypress');
                save_response("B",n)
                submit_form();
                keyboard_unlock();
            }
        });
        $("#button-C-"+n).click(function(){
            if (!$(document).locked){
                keyboard_lock();
                $(document).unbind('keypress');
                save_response("C",n)
                submit_form();
                keyboard_unlock();
            }
        });
    }
    else{
        // activate the next regular form
        button_A.data('n',n);
        button_A.click(function(){
            if (!(document).locked){
                var n =$(this).data('n'); 
                keyboard_lock();
                save_response("A",n);
                show_next_form(n);
                keyboard_unlock();
            }
        });
        button_B.data('n',n);
        button_B.click(function(){
            if (!$(document).locked){
                var n =$(this).data('n'); 
                keyboard_lock();
                save_response("B",n);
                show_next_form(n);
                keyboard_unlock();
            }
        });
        button_C.data('n',n);
        button_C.click(function(){
            if (!$(document).locked){
                var n =$(this).data('n'); 
                keyboard_lock();
                save_response("C",n);
                show_next_form(n);
                keyboard_unlock();
            }
        });



        
    }   
    
    $(document).keypress(function(event){
        //$(".debug").html(event.which());
        if (!$(document).locked){
                if (event.which == 106){
                //    $(".debug").html(''+event.which);
                    button_A.fadeTo(100,0.5).queue(function(next) {
                            $(this).trigger("click")
                            next();
                    });
        //            $("#button-A-"+n).click();
                }
                if (event.which == 107){
                    button_B.fadeTo(100,0.5).queue(function(next) {
                            $(this).trigger("click")
                            next();
                    });
                }
                if (event.which == 108){
                    button_C.fadeTo(100,0.5).queue(function(next) {
                            $(this).trigger("click")
                            next();
                    });
                }
        }

    });



}











function callAjax(data,url, callback){
    my_delay = 1000;
    $.ajax({
        url: url,
        type: "POST",
        data: {"result":JSON.stringify(data)},
        dataType: "text",
        tryCount : 0,
        retryLimit : 5,
        success: function(response){
                        callback(response);
                }
           /* response = response_text;
            console.log('Ajax request returned successfully.');
            if (response == "SUCCESS")
                if (url_success != '')
                    window.location.replace(url_success);
                                
        }*/ 
        
        /*,
        error : function(xhr, textStatus, errorThrown ) {
                console.log('Ajax request failed.');
                if (textStatus == 'timeout') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        $.ajax(this);
                        return;
                    }            
                    return;
                }
                if (xhr.status == 404) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        setTimeout(callAjax, my_delay);
                        return;
                    }            
                    return;
                } 
                else{
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        setTimeout(callAjax, my_delay);
                        return;
                    }            
                    return;
                } 
        }*/
    });
    
    
}



/* a dictionary storing the current state of
all rows. 0 is unselected, 1 is selected. */
row_stats = {};
pageno = 0;
username = '';
debug = {};
function initialize(n,u){
    pageno = n;
    username = u;
    debug = $("#debug");
    num_records = $(".record").length;

    $(".record").click(function(){
                
                $(this).toggleClass("selected");
    });

    $("#button-submit").click(function(){
       results = compile_data();
       callAjax(results, url_submit,submit_callback);
    });
}


function submit_callback(response){
    if (response == "SUCCESS")
        window.location.replace( url_pages +  username + "/");
        //window.location.replace( url_pages +  username + "/" + (pageno+1));
}



function compile_data(){
    records = $(".record");
    var result_data = {'username': username, 'pageno': pageno, 'data':{} , 'comment':''};
    records.each(function(index,element){
        var id = $(this).find(".id").text();
        var identity = $(this).find(".identity").text();
        var is_focus = 0+$(this).hasClass("focus_identity");
        var is_selected = 0+$(this).hasClass("selected");
        result_data['data'][id] = [identity,is_focus,is_selected]; 
        //console.log(id,identity,is_focus,is_selected);
    });
    var comment_text = $("#comments_textarea").val();
    result_data['comment'] = comment_text;
    //console.log(result_data);

    return result_data;
    //console.log(data);
}



