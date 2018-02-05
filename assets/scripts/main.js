// login callback
function loginCallback(response) {
    if (response.status === "PARTIALLY_AUTHENTICATED") {
        document.getElementById("code").value = response.code;
        document.getElementById("csrf").value = response.state;

        showOverlay('Validatind user...');

        setTimeout(function(){
            submitValidationForm();
        }, 1000);
    }
    else if (response.status === "NOT_AUTHENTICATED") {
        // handle not authenticated
        hideOverlay();        
        alert('An error occured, handle this. Status: ' + response.status);
    }
    else if (response.status === "BAD_PARAMS") {
        // handle bad parameters
        hideOverlay();
        alert('An error occured, handle this. Status: ' + response.status);
    }
}

// phone form submission handler
function smsLogin(phoneNumber) {
    showOverlay('Please, go to validation screen!');
    AccountKit.login(
        'PHONE',
        {countryCode: '+55', phoneNumber: phoneNumber}, // will use default values if not specified
        loginCallback
    );
}

// email form submission handler
function emailLogin(email) {
    showOverlay('Please, go to validation screen!');
    AccountKit.login(
        'EMAIL',
        {email: email},
        loginCallback
    );
}

function showOverlay(message) {
    $('.block-msg h1').text(message);
    $('.block').show();
}

function hideOverlay() {
    $('.block').hide();
}

function submitForm() {

        showOverlay('Please wait...');

        var data = $('#signup-form').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
    
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8000/api/auth/registration/',
            data: data,
            success: function(response) {
                setTimeout(function() {
                    $('#signup-form').hide();
        
                    document.getElementById("token").value = response.token;
        
                    $('#page-title').text('Registration completed!');
                    $('#page-text').empty().append('<p>Now choose the method below to validate your account.</p>');
                    $('#page-text').append('<p><button onClick="smsLogin(\'' + response.user.phone_number + '\')" class="btn btn-lg btn-primary btn-block" type="button">Via SMS</button></p><p>or</p>');
                    $('#page-text').append('<p><button onClick="emailLogin(\'' + response.user.email + '\')" class="btn btn-lg btn-primary btn-block" type="button">Via Email</button></p>');
        
                    hideOverlay();
                }, 1000);
            }
        });
    
}

function submitValidationForm() {

    var validationData = $('#validation-form').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8000/api/auth/validation/',
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Authorization", "Token " + validationData.token);
        },
        data: validationData,
        dataType: "json",
        success: function(response) {

            $('#page-title').text(response.message);
            $('#page-text').empty().append('<p>You are now ready to log in on our platform. Enjoy it.</p>');

            hideOverlay();
        }
    });
}