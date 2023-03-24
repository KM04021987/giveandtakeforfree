$(document).ready(function(){
    console.log('sendrequest')
    $("form#sendrequest").on('click', function(e){
        e.preventDefault();
        let id = $('#account').val();
        let item = event.target.value;
        let data = {
            account: id, 
            itemno: item
        }

        $.ajax({
            type: 'post',
            url: '/show-list-of-givers/requestContactNumber/id',
            cache: false,
            data: data,
            dataType: "JSON",
            success: function(data){
                console.log(data)
                if (data.message.substring(0,7) === "Success") {
                    //alert(data.message);
                    return;
                }
                else {
                    alert(data.message);
                    window.location.href = `${window.location.origin}/show-list-of-givers/requestContactNumber/id`;       
                }
            },
            error: function(err){
                alert("Error while requesting the contact number. Please try again.");
                window.location.href = `${window.location.origin}/show-list-of-givers/requestContactNumber/id`;
            }
        })
    });
});