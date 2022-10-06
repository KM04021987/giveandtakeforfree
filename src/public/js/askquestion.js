$(document).ready(function(){
    console.log('askquestion')
    $("form#askquestion").on('submit', function(e){
        e.preventDefault();
        let fullname = $('#fullname').val();
        let email = $('#email').val();
        let messagecontent = $('#messagecontent').val();
        let data = {
            fullname: fullname,
            email: email,
            messagecontent: messagecontent
        }

        $.ajax({
            type: 'post',
            url: '/contact',
            cache: false,
            data: data,
            dataType: "JSON",
            success: function(data){
                alert(data.message);
                window.location.href = `${window.location.origin}/contact`;
            },
            error: function(err){
                alert("Error while submitting the queries. Please try again.");
                window.location.href = `${window.location.origin}/contact`;
            }
        })
    });
});