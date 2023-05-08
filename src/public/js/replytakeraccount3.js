$(document).ready(function(){
    console.log('replytakeraccount3')
    $("form#replytakeraccount3").on('click', function(e){
        e.preventDefault();
        let item = event.target.value;
        let data = {
            item: item
        }

        $.ajax({
            type: 'post',
            url: '/get-giving-history/reply-taker-account3/id',
            cache: false,
            data: data,
            dataType: "JSON",
            success: function(data){
                if (data.message.substring(0,7) === "Success") {
                    alert(data.message);
                    location.reload();  
                }
                else {
                    alert(data.message);
                }
            },
            error: function(err){
                alert("Error while replying the request. Please try again.");
            }
        })
    });
});