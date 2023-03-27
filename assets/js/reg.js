$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready
    $("#continueRegDiv").hide();
    
    $("#login_form").submit(function(e){
        e.preventDefault(); //stop submit
        $("#load_btn").prop('disabled', true); //disable submit button
        mat_no = $("#searchMatno").val().replace(/ /g, "");
        let pwd = $("#pswSearch").val();
        $.get("https://unibencoursereg.000webhostapp.com/login.php", {mat_no:mat_no, pwd:pwd},function(data, status){
            if (data == "2") {
                alert("Matriculation Number Doesnot exist. Start Course Registration");
                $('#load_btn').removeAttr('disabled');
            } else if (data == "6") {
                alert("Incorrect Password For this Matriculation Number");
                $('#load_btn').removeAttr('disabled');
            } else if (data == "4") {
                sessionStorage.setItem("mat_no", mat_no);
                sessionStorage.setItem("method", "edit");
                // Simulate a mouse click:
                window.location.href= "register.html";
            }
            
        });
    });

    // Hide and Show Password Content
    // for pwd input
    $("#toggle_pwd").click(function () {
        if ($("#pswSearch").attr("type") == "password"){
            //Change type attribute
            $("#pswSearch").attr("type", "text");
            $("#toggle_pwd").removeClass("fa-eye-slash");
            $("#toggle_pwd").addClass("fa-eye");
        } 
        else{
            //Change type attribute
            $("#pswSearch").attr("type", "password");
            $("#toggle_pwd").removeClass("fa-eye");
            $("#toggle_pwd").addClass("fa-eye-slash");
        }
    });
});

// Working how the continue button does
$("#continueregbtn").click(function(){
    $("#continueRegDiv").show();
    $("#continueregbtn").attr("disabled", "true");
    $("#startregbtn").attr("disabled", "true");
});

$("#startregbtn").click(function(){
    sessionStorage.clear();
    // Simulate a mouse click:
    window.location.href= "register.html";
});