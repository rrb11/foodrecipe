$(document).ready(function(){
    $('#delete').on('click',function(){
        let id = $(this).attr('value');
        let url = '/users/'+id;
        $.ajax({
            url: url,
            type: 'DELETE',
            dataType:'json',
            success: function(result) {
                console.log(result);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
    var del = document.getElementById('delete');
    // del.addEventListener('click', function () {
    //     fetch('/'+id, {
    //         method: 'delete',
    //         headers: {
    //         'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //         'name': 'Darth Vader'
    //         })
    //     })
    //     .then(res => {
    //         if (res.ok) return res.json()
    //     }).
    //     then(data => {
    //         console.log(data)
    //         window.location.reload()
    //     })
    // })
});