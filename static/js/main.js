$(document).ready(function(){
    $("#reset-form").submit(function(e){
        let newPass = $('#new_pass').val();
        let newRePass = $("#new_re_pass").val();
        if(newPass !== newRePass) {
            e.preventDefault();
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'passwords do not match'
              })
        }
      
    });
  });