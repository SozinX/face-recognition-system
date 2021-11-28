var train_data = {
    name: "",
    file: null
};
var recognize_data = {
    file: null
};
var message = null;
var message_check = null;
var active_section = null;
function render(){
   $('.form-item input').val('');
   $('.tabs li').removeClass('active');
   $('.tabs li:first').addClass('active');
   active_section = 'train-content';
   $('#'+active_section).show();
};

function update(){
    if(message){
        $('.message').html('<p class="'+_.get(message, 'type')+'">'+_.get(message, 'message')+'</p>');
    }
    $('#train-content, #recognize-content').hide();
    $('#'+active_section).show();
    if (active_section=="recognize-content"){
            $("#message_checking").show()
        }else{
                $("#message_checking").hide()
        };

}
function update_check(){
    if(message_check){
        $('.message_check').html('<p class="'+_.get(message_check, 'type')+'">'+_.get(message_check, 'message')+'</p>');
    }
    $('#train-content, #recognize-content').hide();
    $('#'+active_section).show();
     if (active_section=="recognize-content"){
            $("#message_checking").show()
        }else{
                $("#message_checking").hide()
        };
}


$(document).ready(function(){
    $('.tabs li').on('click', function(e){
        var $this = $(this);
        active_section = $this.data('section');
        $('.tabs li').removeClass('active');
        $this.addClass('active');
        update();
    });
    $('#train #input-file').on('change', function(event){
        train_data.file = _.get(event, 'target.files[0]', null);
    });
    $('#name-field').on('change',function(event){
        train_data.name = _.get(event, 'target.value', '');
    });
    $('#train').submit(function(event){
        message = null;
        message_check = null;
        if(train_data.name && train_data.file){
            var train_form_data = new FormData();
            train_form_data.append('name', train_data.name)
            train_form_data.append('file', train_data.file)
            axios.post('/api/train', train_form_data).then(function(response){
                message = {type: 'success', message: 'The person has been added with id: '+_.get(response, 'data.id')};
                update();
            }).catch(function(error){
               message = {type:'error', message:_.get(error,'response.data.error.message', 'Unknown error')}
               update();
            });
        }else{
            message = {type:"error", message: "Name and face image is required"}
            update();
        }
        update();
        event.preventDefault();
    });
    $('#recognize-input-file').on('change', function(e){
        recognize_data.file = _.get(e, 'target.files[0]',null)
    });
    $('#recognize').submit(function(e){
        var recog_form_data = new FormData();
        recog_form_data.append('file', recognize_data.file);
        axios.post('/api/recognize', recog_form_data).then(function(response){
            message_check = {type:'success', message: response.data.user.name+" was found in the photo"};
            update_check();
        }).catch(function(err){
            message_check = {type:'error', message: _.get(err, 'response.data.message', 'No one was found in the photo')};
            update_check();
        });
        e.preventDefault();
    });
render();
});


