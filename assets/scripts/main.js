// login callback
function loginCallback(response) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
        document.getElementById("code").value = response.code;
        document.getElementById("csrf").value = response.state;
        subimitForm();
    }
    else if (response.status === "NOT_AUTHENTICATED") {
        // handle not authenticated
        alert('An error occured, handle this. Status: ' + response.status);
        $('.block').hide();
    }
    else if (response.status === "BAD_PARAMS") {
        // handle bad parameters
        alert('An error occured, handle this. Status: ' + response.status);
        $('.block').hide();
    }
}

// phone form submission handler
function smsLogin() {
    $('.block').show();
    var phoneNumber = document.getElementById("phone_number").value;
    var login_window = AccountKit.login(
        'PHONE',
        {countryCode: '+55', phoneNumber: phoneNumber}, // will use default values if not specified
        loginCallback
    );

    console.log(login_window);
}

// email form submission handler
function emailLogin() {
    AccountKit.login(
        'EMAIL',
        {},
        loginCallback
    );
}

function subimitForm() {
    var data = $('form').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8000/api/auth/registration/',
        data: data,
        success: function(response) {
            $('form').hide();
            $('.result code').append(JSON.stringify(response));
            $('.result').show();
        }
    })

    $('.block').hide();
}