function editprofile() {
    console.log('editprofile')
    $("form#editprofile").on('submit', function(e){
        e.preventDefault();
        let phone = $('#phone').val();
        let country = $('#countrySelect').val();
        let state = $('#stateSelect').val();
        let city = $('#city').val();
        let pin = $('#pin').val();
        let address = $('#address').val();
        let data = {
            phone: phone,
            country: country,
            state: state,
            city: city,
            pin: pin,
            address: address
        }

        $.ajax({
            type: 'put',
            url: '/put-edit-profile',
            cache: false,
            data: data,
            dataType: "JSON",
            success: function(data){
                if (data.message.substring(0,7) === "Success") {
                    alert(data.message);
                    window.location.href = `${window.location.origin}/profile`;
                }
                else {
                    alert(data.message);      
                }
            },
            error: function(err){
                alert("Error while updating the profile. Please try again.");
            }
        })
    });
};


function changepassword() {
    console.log('changepassword')
    $("form#changepassword").on('submit', function(e){
        e.preventDefault();
        let opassword = $('#opassword').val();
        let password = $('#password').val();
        let passwordConfirmation = $('#passwordConfirmation').val();
        let data = {
            opassword: opassword,
            password: password,
            passwordConfirmation: passwordConfirmation
        }

        $.ajax({
            type: 'put',
            url: '/put-change-password',
            cache: false,
            data: data,
            dataType: "JSON",
            success: function(data){
                if (data.message.substring(0,7) === "Success") {
                    alert(data.message);
                    window.location.href = `${window.location.origin}/profile`;
                }
                else {
                    alert(data.message);      
                }
            },
            error: function(err){
                alert("Error while changing the password. Please try again.");
            }
        })
    });
};

$(document).ready(function(e) {
    editprofile();
    changepassword();
});