$(document).ready(function(){
    console.log('createuser')
    $("form#createuser").on('submit', function(e){
        e.preventDefault();
        let fullname = $('#fullname').val();
        let phone = $('#phone').val();
        let country = $('#countrySelect').val();
        let state = $('#stateSelect').val();
        let city = $('#city').val();
        let pin = $('#pin').val();
        let address = $('#address').val();
        let password = $('#password').val();
        let passwordConfirmation = $('#passwordConfirmation').val();
        let data = {
            fullname: fullname,
            phone: phone,
            country: country,
            state: state,
            city: city,
            pin: pin,
            address: address,
            password: password,
            passwordConfirmation: passwordConfirmation
        }

        $.ajax({
            type: 'post',
            url: '/register',
            cache: false,
            data: data,
            dataType: "JSON",
            success: function(data){
                if (data.message.substring(0,7) === "Success") {
                    alert(data.message);
                    window.location.href = `${window.location.origin}/login`;
                }
                else {
                    alert(data.message);
                    window.location.href = `${window.location.origin}/register`;       
                }
            },
            error: function(err){
                alert("Error while creating the account. Please try again.");
                window.location.href = `${window.location.origin}/register`;
            }
        })
    });
});