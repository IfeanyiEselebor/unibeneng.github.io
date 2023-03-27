$(document).ready(function() {
// executes when HTML-Document is loaded and DOM is ready
    // Get Database 
    $.getJSON('https://unibencoursereg.000webhostapp.com/get_db.php', function(json) {
        db = json;
        // Getting info from session variable
        session_mat_no = sessionStorage.getItem("mat_no");
        session_method = sessionStorage.getItem("method");
        if (session_method == 'edit') {
            // Remove required attribute from pwd and image
            $('#pwd').removeAttr('required');
            $('#conpwd').removeAttr('required');
            $('#passport_input').removeAttr('required');
            // Get the students info for the corresponding mat_no
            students_info = [];
            for (var i = 0; i < db.length; i++){
                if (db[i]["MAT_NO"] == session_mat_no) {
                    students_info = db[i];
                }
            }
            if (students_info === undefined || students_info.length == 0) {
                sessionStorage.clear();
                // Simulate a mouse click:
                window.location.href= "register.html";
            }
            if (students_info['been_submitted'] == 1) {
                sessionStorage.clear();
                sessionStorage.setItem("mat_no", session_mat_no);
                alert('Course Registration already submitted to course adviser');
                // Simulate a mouse click:
                window.location.href= "printall.html";
            }
            // Old Value 
            course_id = students_info['course_id'];
            // Populate field with previous data 
            $("#matno").val(students_info['MAT_NO']);
            $("#students_surname").val(students_info["SURNAME"]);
            $("#students_firstname").val(students_info["FIRSTNAME"]);
            $("#students_othernames").val(students_info["OTHERNAMES"]);
            $('#dept_id').val(students_info["DEPT_ID"]);
            $('#session').val(students_info["SESSION"]);
            $('#level').val(students_info["LEVEL"]);
            $('#year_of_entry').val(students_info["YEAR_OF_ENTRY"]);
            $('#session_of_entry').val(students_info["SESSION_OF_ENTRY"]);
            $('#mode_of_entry').val(students_info["MODE_OF_ENTRY"]);
            $("#dob").val(students_info["DATE_OF_BIRTH"]);
            $("#students_email").val(students_info["EMAIL"]);
            $("#students_phone").val(students_info["PHONE"]);
            $('#gender').val(students_info["GENDER"]);
            $('#fees').val(students_info["FEES"]);
            $('#status').val(students_info["STATUS"]);
            $('#preview').attr("src", students_info["img_content"]);
            for (let i = 0; i < students_info['FIRST_SEMSESTER_COURSES'].split(";").length; i++ ) {
                course1 = students_info['FIRST_SEMSESTER_COURSES'].split(";")[i];
                $('#first_semester_course').val(course1);
                $("#first_semester_add").click();
            }
            for (let i = 0; i < students_info['SECOND_SEMSESTER_COURSES'].split(";").length; i++ ) {
                course2 = students_info['SECOND_SEMSESTER_COURSES'].split(";")[i];
                $('#second_semester_course').val(course2);
                $("#second_semester_add").click();
            }
        }
        $("#reg_form").submit(function(e){
            e.preventDefault(); //stop submit
            $("#submit_btn").prop('disabled', true); //disable submit button
            // getting value from input
            mat_no = $("#matno").val().replace(/ /g, "");
            students_surname = $("#students_surname").val().replace(/ /g, "");
            students_firstname = $("#students_firstname").val().replace(/ /g, "");
            students_othernames = $("#students_othernames").val().replace(/ /g, "");
            dept_id = $("#dept_id").val();
            session = $("#session").val();
            level = $("#level").val();
            year_of_entry = $("#year_of_entry").val();
            session_of_entry = $("#session_of_entry").val();
            mode_of_entry = $("#mode_of_entry").val();
            pwd = $("#pwd").val();
            conpwd = $("#conpwd").val();
            dob = $("#dob").val();
            students_email = $("#students_email").val().replace(/ /g, "");
            students_phone = $("#students_phone").val().replace(/ /g, "");
            gender = $("#gender").val();
            fees = $("#fees").val();
            students_status = $("#status").val();
            all_first_courses = $("#all_first_courses").val();
            all_second_courses = $("#all_second_courses").val();
            first_course_unit = $("#first_credit_total").val();
            second_course_unit = $("#second_credit_total").val();
            
            //  Validating mat_no
            let regex_mat_no = /^ENG([0-9])/;
            if (regex_mat_no.test(mat_no) != true) {
                alert("Invalid Matriculation Number!");
                $('#submit_btn').removeAttr('disabled');
            }

            // To confirm pwd and conpwd are same
            if (pwd != conpwd) {
                alert("Password doesnot match!!");
                $('#submit_btn').removeAttr('disabled');
                return;
            }
            if (first_course_unit == 0 || second_course_unit == 0) {
                alert("Invalid Course Selection!!");
                $('#submit_btn').removeAttr('disabled');
                return;
            }
            if (session_method == 'edit') {
                // Edit form
                // check if mat no doesnot exist already
                $.get("https://unibencoursereg.000webhostapp.com/checkmatno.php", {mat_no:mat_no, method:'edit', course_id: course_id},function(data, status){
                    if (data != "2") {
                        alert("Course Registration is already done for this Matriculation Number!!");
                        $('#submit_btn').removeAttr('disabled');
                        return;
                    } else{
                        if (pwd !== "") {
                            if (students_info['PASSWORD'] == pwd) {
                                alert('Password cannot be the same as previous password.');
                                $('#submit_btn').removeAttr('disabled');
                                return;
                            }
                        }else{
                            pwd = null;
                        }
                        if (mat_no != students_info['MAT_NO'] || students_surname != students_info["SURNAME"] || students_firstname != students_info["FIRSTNAME"] || students_othernames != students_info["OTHERNAMES"] || dept_id != students_info["DEPT_ID"] || session != students_info["SESSION"] || level != students_info["LEVEL"] || year_of_entry != students_info["YEAR_OF_ENTRY"] || session_of_entry != students_info["SESSION_OF_ENTRY"] || mode_of_entry != students_info["MODE_OF_ENTRY"] || pwd != students_info["PASSWORD"] && pwd != null || dob != students_info["DATE_OF_BIRTH"] || students_email != students_info["EMAIL"] || students_phone != students_info["PHONE"] || gender != students_info["GENDER"] || fees != students_info["FEES"] || students_status != students_info["STATUS"] || all_first_courses != students_info["FIRST_SEMSESTER_COURSES"] || all_second_courses != students_info["SECOND_SEMSESTER_COURSES"] || first_course_unit != students_info["first_course_unit"] || second_course_unit != students_info["second_course_unit"] || document.querySelector('#passport_input').files.length != 0) {
                            if (document.querySelector('#passport_input').files.length != 0) {
                                var file = document.querySelector('#passport_input').files[0];  
                                var reader = new FileReader();
                                reader.onloadend = function() {
                                    update_imagebase64 = reader.result;
                                    //update students to the db
                                    // create array
                                    new_students_info = {
                                        "search_mat_no" : session_mat_no,
                                        "course_id" : course_id,
                                        "MAT_NO": mat_no,
                                        "SURNAME": students_surname,
                                        "FIRSTNAME": students_firstname,
                                        "OTHERNAMES": students_othernames,
                                        "DEPT_ID": dept_id,
                                        "SESSION": session,
                                        "LEVEL": level,
                                        "YEAR_OF_ENTRY": year_of_entry,
                                        "SESSION_OF_ENTRY": session_of_entry,
                                        "MODE_OF_ENTRY": mode_of_entry,
                                        "PASSWORD": pwd,
                                        "DATE_OF_BIRTH": dob,
                                        "EMAIL": students_email,
                                        "PHONE": students_phone,
                                        "GENDER": gender,
                                        "FEES": fees,
                                        "STATUS": students_status,
                                        "FIRST_SEMSESTER_COURSES": all_first_courses,
                                        "SECOND_SEMSESTER_COURSES": all_second_courses,
                                        "first_course_unit": first_course_unit,
                                        "second_course_unit": second_course_unit,
                                        "img_content" : update_imagebase64
                                    }
                                    $.ajax({
                                        method: "POST",
                                        contentType: "application/json; charset=utf-8",
                                        url: "https://unibencoursereg.000webhostapp.com/updaterecord.php",
                                        data: JSON.stringify(new_students_info),
                                        cache: false,
                                        success: function(result) {
                                            if (result == 1) {
                                                sessionStorage.clear();
                                                sessionStorage.setItem("mat_no", mat_no);
                                                alert('Course Registration edited successfully');
                                                // Simulate a mouse click:
                                                window.location.href= "printall.html";
                                            } 
                                            else {
                                                alert('Editing Course Registration Failed!');  
                                            }
                                        }
                                    });
                                };
                                reader.readAsDataURL(file); 
                            }else{
                                 //update students to the db
                                // create array
                                new_students_info = {
                                    "search_mat_no" : session_mat_no,
                                    "course_id" : course_id,
                                    "MAT_NO": mat_no,
                                    "SURNAME": students_surname,
                                    "FIRSTNAME": students_firstname,
                                    "OTHERNAMES": students_othernames,
                                    "DEPT_ID": dept_id,
                                    "SESSION": session,
                                    "LEVEL": level,
                                    "YEAR_OF_ENTRY": year_of_entry,
                                    "SESSION_OF_ENTRY": session_of_entry,
                                    "MODE_OF_ENTRY": mode_of_entry,
                                    "PASSWORD": pwd,
                                    "DATE_OF_BIRTH": dob,
                                    "EMAIL": students_email,
                                    "PHONE": students_phone,
                                    "GENDER": gender,
                                    "FEES": fees,
                                    "STATUS": students_status,
                                    "FIRST_SEMSESTER_COURSES": all_first_courses,
                                    "SECOND_SEMSESTER_COURSES": all_second_courses,
                                    "first_course_unit": first_course_unit,
                                    "second_course_unit": second_course_unit,
                                    "img_content" : null
                                }
                                $.ajax({
                                    method: "POST",
                                    contentType: "application/json; charset=utf-8",
                                    url: "https://unibencoursereg.000webhostapp.com/updaterecord.php",
                                    data: JSON.stringify(new_students_info),
                                    cache: false,
                                    success: function(result) {
                                        if (result == 1) {
                                            sessionStorage.clear();
                                            sessionStorage.setItem("mat_no", mat_no);
                                            alert('Course Registration edited successfully');
                                            // Simulate a mouse click:
                                            window.location.href= "printall.html";
                                        } 
                                        else {
                                            alert('Editing Course Registration Failed!');  
                                        }
                                    }
                                });
                            }
                        }
                        else{
                            sessionStorage.clear();
                            sessionStorage.setItem("mat_no", mat_no);
                            // Simulate a mouse click:
                            window.location.href= "printall.html";
                        }
                    }
                });
            } 
            else {
                // check if mat no doesnot exist already
                $.get("https://unibencoursereg.000webhostapp.com/checkmatno.php", {mat_no:mat_no, method:'reg', course_id: ''},function(data, status){
                    if (data != "2") {
                        alert("Course Registration is already done for this Matriculation Number!!");
                        $('#submit_btn').removeAttr('disabled');
                        return;
                    } else {
                        // Upload image to db
                        var file = document.querySelector('#passport_input').files[0];  
                        var reader = new FileReader();
                        reader.onloadend = function() {  
                            imagebase64 = reader.result;
                            // create array
                            new_students = {
                                "MAT_NO": mat_no,
                                "SURNAME": students_surname,
                                "FIRSTNAME": students_firstname,
                                "OTHERNAMES": students_othernames,
                                "DEPT_ID": dept_id,
                                "SESSION": session,
                                "LEVEL": Number(level),
                                "YEAR_OF_ENTRY": Number(year_of_entry),
                                "SESSION_OF_ENTRY": session_of_entry,
                                "MODE_OF_ENTRY": mode_of_entry,
                                "PASSWORD": pwd,
                                "DATE_OF_BIRTH": dob,
                                "EMAIL": students_email,
                                "PHONE": students_phone,
                                "GENDER": gender,
                                "FEES": fees,
                                "STATUS": students_status,
                                "FIRST_SEMSESTER_COURSES": all_first_courses,
                                "SECOND_SEMSESTER_COURSES": all_second_courses,
                                "first_course_unit": first_course_unit,
                                "second_course_unit": second_course_unit,
                                "img_content" : imagebase64
                            }
                            //adds new_students to the db
                            $.ajax({
                                method: "POST",
                                contentType: "application/json; charset=utf-8",
                                url: "https://unibencoursereg.000webhostapp.com/insertrecord.php",
                                data: JSON.stringify(new_students),
                                cache: false,
                                success: function(result) {
                                    if (result == 1) {
                                        sessionStorage.clear();
                                        sessionStorage.setItem("mat_no", mat_no);
                                        alert('Course Registration Done successfully');
                                        // Simulate a mouse click:
                                        window.location.href= "printall.html";
                                    } 
                                    else {
                                        alert('Course not successfully registred');  
                                    }
                                }
                            });
                        };
                        reader.readAsDataURL(file);  
                        $('#submit_btn').removeAttr('disabled');
                    }
                });
            }
        });
    });
    // Hide and Show Password Content
    // for pwd input
    $("#toggle_pwd").click(function () {
        if ($("#pwd").attr("type") == "password"){
            //Change type attribute
            $("#pwd").attr("type", "text");
            $("#toggle_pwd").removeClass("fa-eye-slash");
            $("#toggle_pwd").addClass("fa-eye");
        } 
        else{
            //Change type attribute
            $("#pwd").attr("type", "password");
            $("#toggle_pwd").removeClass("fa-eye");
            $("#toggle_pwd").addClass("fa-eye-slash");
        }
    });
    // Hide and Show Password Content
    // for con_pwd input
    $("#toggle_pwd-1").click(function () {
        if ($("#conpwd").attr("type") == "password"){
            //Change type attribute
            $("#conpwd").attr("type", "text");
            $("#toggle_pwd-1").removeClass("fa-eye-slash");
            $("#toggle_pwd-1").addClass("fa-eye");
        } 
        else{
            //Change type attribute
            $("#conpwd").attr("type", "password");
            $("#toggle_pwd-1").removeClass("fa-eye");
            $("#toggle_pwd-1").addClass("fa-eye-slash");
        }
    });
});
// add to first semester subject on add button
$("#first_semester_add").click(function(){
    selectElement = document.getElementById('first_semester_course');
    const courseregex =  new RegExp(selectElement.value);
    let first_credit_total = document.getElementById('first_credit_total').value;
    all_first_courses_input = document.getElementById('all_first_courses');
    if(courseregex.test(all_first_courses_input.value)== true){
        alert("Course already added.");
    } 
    else{
        course_unit = getCredit(selectElement.value);
        if (Number(document.getElementById('Total_credit_unit').value) + Number(course_unit) > 50|| Number(document.getElementById('first_credit_total').value) + Number(course_unit) > 30) {
            alert("You cannot register more than 50 credits and 30 credits per semester");
        } 
        else{
            document.getElementById('first_credit_total').value = Number(first_credit_total) + Number(course_unit);
            document.getElementById('Total_credit_unit').value = Number(document.getElementById('Total_credit_unit').value) + Number(course_unit);
            coursecode_display("first_semester_list", selectElement.value);
            all_coursecode_display("all_first_courses", selectElement.value);
        }
    }
});
// add to second semester subject on add button
$("#second_semester_add").click(function(){
    selectElement = document.getElementById('second_semester_course');
    const courseregex =  new RegExp(selectElement.value);
    let second_credit_total = document.getElementById('second_credit_total').value;
    all_second_courses_input = document.getElementById('all_second_courses');
    if(courseregex.test(all_second_courses_input.value)== true){
        alert("Course already added.");
    } 
    else{
        course_unit = getCredit(selectElement.value);
        if (Number(document.getElementById('Total_credit_unit').value) + Number(course_unit) > 50|| Number(document.getElementById('second_credit_total').value) + Number(course_unit) > 30) {
            alert("You cannot register more than 50 credits and 30 credits per semester");
        }
        else{
            document.getElementById('second_credit_total').value = Number(second_credit_total) + Number(course_unit)
            document.getElementById('Total_credit_unit').value = Number(document.getElementById('Total_credit_unit').value) + Number(course_unit);
            coursecode_display("second_semester_list", selectElement.value);
            all_coursecode_display("all_second_courses", selectElement.value);
        }
    }
});
function showPreview(event, uploadltn){
    if(event.target.files.length > 0){
        if ((event.target.files[0].size / 1024000) > 1) {
            alert("You can only upload an image of max size of 1024kb. Compress image and upload again");
            uploadltn.value = "";
            return;
        }
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("preview");
        preview.src = src;
    }
}
function all_coursecode_display(divname, val) {
    if (document.getElementById(divname).value == "") {
        document.getElementById(divname).value +=`${val}`;
    } else{
        document.getElementById(divname).value +=`;${val}`;
    }
}
function coursecode_display(divname, val) {
    if (divname == 'first_semester_list') {
        document.getElementById(divname).innerHTML +=
        `<div>
            <div class="input-group">
            <input class="border-light form-control" type="text" readonly="" value="${val}">
            <button class="btn btn-danger btn-lg" type="button" onclick="remove_course('${val}', 'first', this)">Remove</button>
            </div>
        <br>
        </div>`;
    } else if (divname == 'second_semester_list') {
        document.getElementById(divname).innerHTML +=
        `<div>
            <div class="input-group">
            <input class="border-light form-control" type="text" readonly="" value="${val}">
            <button class="btn btn-danger btn-lg" type="button" onclick="remove_course('${val}', 'second', this)">Remove</button>
            </div>
        <br>
        </div>`;
    }
}
function remove_course(coursecode, semester, btnltn){
    btnltn.disabled = true;
    btnltn.parentNode.parentNode.remove();
    const courseregex =  new RegExp(';'+coursecode);
    const courseregex1 =  new RegExp(coursecode);
    if (semester == 'first') {
        all_first_courses_input = document.getElementById('all_first_courses');
        if(courseregex.test(all_first_courses_input.value)== true){
            all_first_courses_input.value = all_first_courses_input.value.replace(courseregex, "");
        } else{
            all_first_courses_input.value = all_first_courses_input.value.replace(courseregex1, "");
        }
        // Literal syntax
        var regex1 = /^;/;
        if(regex1.test(all_first_courses_input.value)) {
            all_first_courses_input.value = all_first_courses_input.value.replace(regex1, "");
        }
        let first_credit_total = document.getElementById('first_credit_total').value;
        course_unit = getCredit(coursecode);
        document.getElementById('first_credit_total').value = Number(first_credit_total) - Number(course_unit);
    } 
    else if (semester == 'second') {
        all_second_courses_input = document.getElementById('all_second_courses');
        if(courseregex.test(all_second_courses_input.value)== true){
            all_second_courses_input.value = all_second_courses_input.value.replace(courseregex, "");
        } else{
            all_second_courses_input.value = all_second_courses_input.value.replace(courseregex1, "");
        }
        // Literal syntax
        var regex1 = /^;/;
        if(regex1.test(all_second_courses_input.value)) {
            all_second_courses_input.value = all_second_courses_input.value.replace(regex1, "");
        }
        let second_credit_total = document.getElementById('second_credit_total').value;
        course_unit = getCredit(coursecode);
        document.getElementById('second_credit_total').value = Number(second_credit_total) - Number(course_unit);
    }
    document.getElementById('Total_credit_unit').value = Number(document.getElementById('Total_credit_unit').value) - Number(course_unit);
}
function getCredit(paramCourse) {
    //var dCredit = glb_Courses.find(paramCourse).course_unit;
    for (var i = 0; i < glb_Courses.length; i++){
        if (glb_Courses[i]["course_code"] == paramCourse) {
            var x = glb_Courses[i];
        }
    } // todo: causes error x is undefined
    if (x == undefined) {
        dCredit = 0;
    } else {
        dCredit = x["course_unit"];
    }
    if (dCredit == undefined) {
        dCredit = 0;
    }
    return dCredit
}
glb_Courses = [
    {
        "course_code": "course_code",
        "course_unit": "0",
        "course_title": "course_title",
        "course_semester": "0",
        "course_level": "0",
        "Teaching_dept": "Teaching_dept",
        "course_order": "course_order",
        "course_dept_idr": "0",
        "course_faculty_idr": "0"
    },
    {
        "course_code": "AGE411",
        "course_unit": "2",
        "course_title": "Irrigation and Drainage Principles",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE504",
        "course_unit": "2",
        "course_title": "Industrial Studies",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE508",
        "course_unit": "2",
        "course_title": "Power and Machinery Systems",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE518",
        "course_unit": "2",
        "course_title": "Rural Water Supply and Sanitation",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE520",
        "course_unit": "2",
        "course_title": "Foundation Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE522",
        "course_unit": "3",
        "course_title": "Agricultural Power Systems",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE526",
        "course_unit": "2",
        "course_title": "Farm Transportation",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE528",
        "course_unit": "2",
        "course_title": "Operations and Management of Farm Power and Machin",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE530",
        "course_unit": "2",
        "course_title": "Processing and Storage of Agricultural Materials",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE532",
        "course_unit": "2",
        "course_title": "Engineering Properties and Handling of Agricultura",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE534",
        "course_unit": "3",
        "course_title": "Advanced Thermodynamics (Heat and Mass Transfer)",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE536",
        "course_unit": "2",
        "course_title": "Solar Energy Applications for Processing and Stora",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE538",
        "course_unit": "2",
        "course_title": "Food and Process Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE540",
        "course_unit": "3",
        "course_title": "Agricultural Machinery",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE542",
        "course_unit": "2",
        "course_title": "Mechanics of Deformable Bodies",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE544",
        "course_unit": "2",
        "course_title": "Water Quality, Epidemiology and Environmental Chem",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE546",
        "course_unit": "2",
        "course_title": "Natural and Environmental Resources Management",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE548",
        "course_unit": "2",
        "course_title": "Engineering Quantities",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE552",
        "course_unit": "2",
        "course_title": "Public Health Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE554",
        "course_unit": "2",
        "course_title": "Safety, Health and Ergonomics",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE556",
        "course_unit": "2",
        "course_title": "Industrial Waste Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE558",
        "course_unit": "2",
        "course_title": "Unit Operations and Processes in Environmental Des",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE560",
        "course_unit": "3",
        "course_title": "Design of Structures for Biomaterials Storage and ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE562",
        "course_unit": "2",
        "course_title": "Applied Biotechnology and Waste Handling Systems",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE564",
        "course_unit": "2",
        "course_title": "Environmental Systems Management in Agricultural E",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE566",
        "course_unit": "2",
        "course_title": "Structures and Environment",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE568",
        "course_unit": "2",
        "course_title": "Silviculture",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE570",
        "course_unit": "2",
        "course_title": "Solid Waste Engineering and Air Pollution",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE572      ",
        "course_unit": "2",
        "course_title": "Measurements and Instrumentation",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE574",
        "course_unit": "3",
        "course_title": "Electrical Installations and Services Design",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE576",
        "course_unit": "3",
        "course_title": "Telecommunication Engineering and Services Design",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE578",
        "course_unit": "2",
        "course_title": "Electrical Power Generation, Transmission and Dist",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE580",
        "course_unit": "2",
        "course_title": "Control and Power Systems Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE582",
        "course_unit": "2",
        "course_title": "Analogue and Digital Computers",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE584",
        "course_unit": "2",
        "course_title": "Micro-Computer Hardware and Software Techniques",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE586",
        "course_unit": "2",
        "course_title": "Information and Electrical Technologies",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE202",
        "course_unit": "2",
        "course_title": "Agricultural Engineering Concept",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE301",
        "course_unit": "2",
        "course_title": "Farm Management, Rural Sociology and Agricultural ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE302",
        "course_unit": "2",
        "course_title": "Basic Agricultural and Bio-resources Engineering",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE303",
        "course_unit": "2",
        "course_title": "Land Surveying, Map Reading and Photogrammetry",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE304",
        "course_unit": "2",
        "course_title": "Machine Component Design and Drawing",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE306",
        "course_unit": "2",
        "course_title": "Aquaculture Engineering",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE308",
        "course_unit": "2",
        "course_title": "Crop Production for Engineers",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE309",
        "course_unit": "2",
        "course_title": "Agricultural and Environmental Engineering Laborat",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE311",
        "course_unit": "2",
        "course_title": "Forestry and Wood Products Engineering",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE312",
        "course_unit": "2",
        "course_title": "Animal Production for Engineers",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE313",
        "course_unit": "2",
        "course_title": "Nursery and Greenhouse Engineering",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE314",
        "course_unit": "2",
        "course_title": "Agricultural and Environmental Engineering Laborat",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE316",
        "course_unit": "2",
        "course_title": "Renewable Energy and Conservation Strategies",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE401",
        "course_unit": "2",
        "course_title": "Advanced     Agricultural      and     Environment",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE403",
        "course_unit": "2",
        "course_title": "Experimental Design and Analysis in Engineering Re",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE413",
        "course_unit": "2",
        "course_title": "Farm Structures and Environmental Control",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE421",
        "course_unit": "3",
        "course_title": "Farm Power and Machinery",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE431",
        "course_unit": "2",
        "course_title": "Properties,  Handling,  Processing  and  Storage  ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE502",
        "course_unit": "2",
        "course_title": "Environmental Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE505",
        "course_unit": "2",
        "course_title": "Automotive Service and Maintenance",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE506",
        "course_unit": "2",
        "course_title": "Professional Engineering Practice",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE507",
        "course_unit": "2",
        "course_title": "Agricultural Wastes Management Systems",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE509",
        "course_unit": "2",
        "course_title": "Biological Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE510",
        "course_unit": "2",
        "course_title": "Agricultural Land Drainage",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE511",
        "course_unit": "2",
        "course_title": "Soil and Water Conservation Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE512",
        "course_unit": "2",
        "course_title": "Irrigation Systems",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE514",
        "course_unit": "3",
        "course_title": "Advanced Hydraulics",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE516",
        "course_unit": "3",
        "course_title": "Design of Irrigation and Soil Conservation Structu",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE521",
        "course_unit": "2",
        "course_title": "Land Clearing and Development",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE523",
        "course_unit": "2",
        "course_title": "Agricultural Mechanization",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE531",
        "course_unit": "2",
        "course_title": "Farm Electrification",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE533",
        "course_unit": "3",
        "course_title": "Design and Construction of Farm Structures",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE550",
        "course_unit": "2",
        "course_title": "Environmental Impact Assessment",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE597",
        "course_unit": "3",
        "course_title": "Project I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "AGE598",
        "course_unit": "3",
        "course_title": "Project II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CED300",
        "course_unit": "2",
        "course_title": "Entrepreneurial Development",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "CED",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE341 ",
        "course_unit": "3",
        "course_title": "Industrial Process Calculations",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE272",
        "course_unit": "2",
        "course_title": "Computer Engineering II",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE301",
        "course_unit": "2",
        "course_title": "Computer Laboratory",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE302",
        "course_unit": "2",
        "course_title": "Computer Laboratory",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE304",
        "course_unit": "1",
        "course_title": "Engineering Communication",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE311",
        "course_unit": "3",
        "course_title": "Circuit Theory 1",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE312",
        "course_unit": "3",
        "course_title": "Circuit Theory II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE313",
        "course_unit": "2",
        "course_title": "Measurement and Instrumentation",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE314",
        "course_unit": "3",
        "course_title": "Electromagnetic Fields and waves",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE321",
        "course_unit": "2",
        "course_title": "Programming Languages II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE322",
        "course_unit": "2",
        "course_title": "Programming Languages II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE324",
        "course_unit": "2",
        "course_title": "Operating System",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE331",
        "course_unit": "2",
        "course_title": "Electric Machines",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE344",
        "course_unit": "1",
        "course_title": "Engineering Communication",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE351",
        "course_unit": "2",
        "course_title": "Communication Principles",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE362",
        "course_unit": "3",
        "course_title": "Software Engineering 1",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE371",
        "course_unit": "2",
        "course_title": "Digital System Design",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE372",
        "course_unit": "3",
        "course_title": "Digital Electronic Circuit",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE375",
        "course_unit": "3",
        "course_title": "Computer Organization and Architecture",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE378",
        "course_unit": "3",
        "course_title": "Software Engineering 1",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE381",
        "course_unit": "3",
        "course_title": "Engineering Mathematics III",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE382",
        "course_unit": "3",
        "course_title": "Engineering Mathematics IV",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE391",
        "course_unit": "2",
        "course_title": "Analogue Circuits",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE399",
        "course_unit": "2",
        "course_title": "SIWES II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE401",
        "course_unit": "2",
        "course_title": "Computer Laboratory",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE433",
        "course_unit": "3",
        "course_title": "Data Communication and Network",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE451",
        "course_unit": "3",
        "course_title": "Control System",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE453",
        "course_unit": "3",
        "course_title": "Microprocessor System and Interfacing",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE457",
        "course_unit": "2",
        "course_title": "Assembly Language Programming",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE461",
        "course_unit": "2",
        "course_title": "Software Engineering II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE475",
        "course_unit": "2",
        "course_title": "Computer Organization and Architecture II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE479",
        "course_unit": "2",
        "course_title": "Prototyping Techniques",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE481",
        "course_unit": "3",
        "course_title": "Numerical Computation and Statistics",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE499",
        "course_unit": "6",
        "course_title": "SIWESIII",
        "course_semester": "2",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE501",
        "course_unit": "3",
        "course_title": "Project and Thesis",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE504",
        "course_unit": "2",
        "course_title": "Engineering Law",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE505",
        "course_unit": "2",
        "course_title": "Engineering Law",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE512",
        "course_unit": "3",
        "course_title": "Digital Signal Processing",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE513",
        "course_unit": "2",
        "course_title": "Cyperpreneurship and Cyber Law",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE514",
        "course_unit": "2",
        "course_title": "Design and Installation of Electrical and ICT Serv",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE515",
        "course_unit": "3",
        "course_title": "Computer Security Techniques I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE516",
        "course_unit": "2",
        "course_title": "Computer Security Technique II",
        "course_semester": "3",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE522",
        "course_unit": "3",
        "course_title": "Digital System Design with VHDL",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE524",
        "course_unit": "2",
        "course_title": "Fuzzy Logic & Programming",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE526",
        "course_unit": "2",
        "course_title": "Robotics and Automation",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE534",
        "course_unit": "2",
        "course_title": "Digital Image Processing",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE544",
        "course_unit": "2",
        "course_title": "Digial Image Processing",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE554",
        "course_unit": "2",
        "course_title": "Cryptography Principles and Applications",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE556",
        "course_unit": "3",
        "course_title": "Computer Graphics",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE571",
        "course_unit": "3",
        "course_title": "Digital Computer Networks",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE573",
        "course_unit": "3",
        "course_title": "Artificial Neural Networks",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE575",
        "course_unit": "3",
        "course_title": "Microprogramming",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE591",
        "course_unit": "3",
        "course_title": "Reliability and Maintainability",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE211",
        "course_unit": "3",
        "course_title": "Strength of Materials I",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE212",
        "course_unit": "3",
        "course_title": "Element of Architecture I",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE311",
        "course_unit": "3",
        "course_title": "Theory of Structures & Strength of Materials II",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE312",
        "course_unit": "3",
        "course_title": "Civil Engineering Materials",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE313",
        "course_unit": "3",
        "course_title": "Elements of Architecture",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE314",
        "course_unit": "2",
        "course_title": "Structural Mechanics I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE316",
        "course_unit": "3",
        "course_title": "Design of Structures I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE341",
        "course_unit": "3",
        "course_title": "Engineering Geology",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE342",
        "course_unit": "2",
        "course_title": "Engineering Geology II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE344",
        "course_unit": "2",
        "course_title": "Soil Mechanics I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE352",
        "course_unit": "3",
        "course_title": "Engineering Surveying and Geoinformatics I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE411",
        "course_unit": "2",
        "course_title": "Structural Mechanics II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE413",
        "course_unit": "2",
        "course_title": "Design of Structure II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE415",
        "course_unit": "2",
        "course_title": "Technical Communication and Computer-aided Design",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE421",
        "course_unit": "2",
        "course_title": "Hydraulics and Hydrology",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE423",
        "course_unit": "2",
        "course_title": "Environmental Engineering",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE431",
        "course_unit": "3",
        "course_title": "Introduction to Transportation Engineering",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE441",
        "course_unit": "2",
        "course_title": "Soil Mechanics II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE451",
        "course_unit": "3",
        "course_title": "Engineering Surveying & Geoinformatics II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE471",
        "course_unit": "3",
        "course_title": "Civil Engineering Practice & Law",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE481",
        "course_unit": "3",
        "course_title": "Applied Engineering Mathematics",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE500",
        "course_unit": "6",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE511",
        "course_unit": "2",
        "course_title": "Structural Mechanics III",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE512",
        "course_unit": "2",
        "course_title": "Structural Mechanics IV",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE513",
        "course_unit": "2",
        "course_title": "Design of Structures III",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE514",
        "course_unit": "2",
        "course_title": "Design of Structure IV",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE515",
        "course_unit": "3",
        "course_title": "Advanced Structural Mechanics",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE516",
        "course_unit": "3",
        "course_title": "Advance Structural Engineering II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE521",
        "course_unit": "2",
        "course_title": "Civil Engineering Hydraulics",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE522",
        "course_unit": "2",
        "course_title": "Engineering Hydrology II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE523",
        "course_unit": "2",
        "course_title": "Engineering Hydrology I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE525",
        "course_unit": "3",
        "course_title": "Water Resources and Environmental Engineering I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE526",
        "course_unit": "3",
        "course_title": "Water Resources and Environmental Engineering II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE531",
        "course_unit": "3",
        "course_title": "Highway Design",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE535",
        "course_unit": "3",
        "course_title": "Traffic Management, Planning and Highway Economics",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE536",
        "course_unit": "3",
        "course_title": "Advance Pavement Design and Construction",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE541",
        "course_unit": "2",
        "course_title": "Geotechnical Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE542",
        "course_unit": "2",
        "course_title": "Geotechnical Engineering II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE545",
        "course_unit": "3",
        "course_title": "Special Topics in Geotechnical Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE546",
        "course_unit": "3",
        "course_title": "Special Topics in Geotechnical Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE565",
        "course_unit": "3",
        "course_title": "Building Technology I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE566",
        "course_unit": "3",
        "course_title": "Building Technology II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE567",
        "course_unit": "3",
        "course_title": "Building and Civil Engineering Measurement and eva",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CVE581",
        "course_unit": "2",
        "course_title": "Laboratory and Design Studio IV",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ECE341",
        "course_unit": "3",
        "course_title": "Engineering Geology",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Agricultural Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ECP281",
        "course_unit": "2",
        "course_title": "Engineering Computer Programming",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ECP576",
        "course_unit": "3",
        "course_title": "Micro Technology",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE211",
        "course_unit": "3",
        "course_title": "Electrical Engineering I",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE211 ",
        "course_unit": "3",
        "course_title": "Electrical Engineering I ",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE212",
        "course_unit": "3",
        "course_title": "Electrical Engineering II",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE272",
        "course_unit": "2",
        "course_title": "Introduction to Computer Engineering",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE311",
        "course_unit": "3",
        "course_title": "Electrical Theory I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE312",
        "course_unit": "3",
        "course_title": "Electrical Theory II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE313",
        "course_unit": "2",
        "course_title": "Electrical/Electronics",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE314",
        "course_unit": "3",
        "course_title": "Electromagnetic Theory",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE316",
        "course_unit": "2",
        "course_title": "Electrical Properties of Materials",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE317",
        "course_unit": "3",
        "course_title": "Electrical Engineering III",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE318",
        "course_unit": "2",
        "course_title": "Electrical Engineering IV",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE331",
        "course_unit": "2",
        "course_title": "Basic Power Machines",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE332",
        "course_unit": "3",
        "course_title": "Electrical Machines I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE371",
        "course_unit": "3",
        "course_title": "Logical Design and Switching Theory",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE372",
        "course_unit": "3",
        "course_title": "Electronic Devices & Circuits",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE375",
        "course_unit": "3",
        "course_title": "Computer Architecture Organization",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE376",
        "course_unit": "3",
        "course_title": "Logic Design & Dig. CKTS",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE431",
        "course_unit": "3",
        "course_title": "Electrical Machines",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE433",
        "course_unit": "3",
        "course_title": "Energy Generation, Distribution and Utilization",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE451",
        "course_unit": "3",
        "course_title": "Control Theory",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE453",
        "course_unit": "3",
        "course_title": "Instrumentation",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE471",
        "course_unit": "3",
        "course_title": "Electronic Circuits I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE473",
        "course_unit": "3",
        "course_title": "Telecommunication  Principles I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE500",
        "course_unit": "6",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE516",
        "course_unit": "3",
        "course_title": "Electrical Service Design",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE522",
        "course_unit": "3",
        "course_title": "High Voltage Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE524",
        "course_unit": "3",
        "course_title": "Power Systems Design",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE531",
        "course_unit": "3",
        "course_title": "Energy Transmission",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE532",
        "course_unit": "3",
        "course_title": "Special Topics in Elect. Machine",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE533",
        "course_unit": "3",
        "course_title": "Power Systems I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE534",
        "course_unit": "3",
        "course_title": "Electrical Machine Design",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE536",
        "course_unit": "3",
        "course_title": "Power Systems II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE538",
        "course_unit": "3",
        "course_title": "Electric Drives and Traction",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE552",
        "course_unit": "3",
        "course_title": "Solid State Electronics",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE562",
        "course_unit": "3",
        "course_title": "Digital communication",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE571",
        "course_unit": "3",
        "course_title": "Electronic Circuit II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE572",
        "course_unit": "3",
        "course_title": "Digital Computers and Systems",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE573",
        "course_unit": "3",
        "course_title": "Telecommunications Principles",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE574",
        "course_unit": "3",
        "course_title": "Telecommunication  Systems",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE576",
        "course_unit": "3",
        "course_title": "Microwave Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE578",
        "course_unit": "3",
        "course_title": "Solid State Electronics & Devices",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE590",
        "course_unit": "0",
        "course_title": "Professional Knowledge in Elect. Eng",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EEE591",
        "course_unit": "3",
        "course_title": "Maintenance and Reliability",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Electrical/Electroni",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ELA201",
        "course_unit": "2",
        "course_title": "Laboratory I",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ELA202",
        "course_unit": "2",
        "course_title": "Laboratory II",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ELA301",
        "course_unit": "2",
        "course_title": "Laboratory III",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ELA301",
        "course_unit": "2",
        "course_title": "Engineering Laboratory & Workshop Practice",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ELA302",
        "course_unit": "2",
        "course_title": "Engineering Laboratory & Workshop Practice",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ELA302",
        "course_unit": "2",
        "course_title": "Laboratory IV",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ELA401",
        "course_unit": "2",
        "course_title": "Laboratory/Workshop Practice",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EMA281",
        "course_unit": "2",
        "course_title": "Engineering Mathematics I",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EMA281 ",
        "course_unit": "2",
        "course_title": "Engineering Mathematics I ",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EMA282",
        "course_unit": "4",
        "course_title": "Engineering Mathematics II",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EMA381",
        "course_unit": "3",
        "course_title": "Engineering Mathematics III",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EMA382",
        "course_unit": "4",
        "course_title": "Engineering Mathematics IV",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "EMA481",
        "course_unit": "3",
        "course_title": "Engineering Mathematics V",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "ENS211",
        "course_unit": "2",
        "course_title": "Engineer in Society",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "GST111",
        "course_unit": "2",
        "course_title": "Use of English I",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "General Studies",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "GST112",
        "course_unit": "2",
        "course_title": "Philosophy and Logic",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "General Studies",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "GST121",
        "course_unit": "2",
        "course_title": "Use of English II",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "General Studies",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "GST122",
        "course_unit": "2",
        "course_title": "Nigerian Peoples and Culture",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "General Studies",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "GST123",
        "course_unit": "2",
        "course_title": "History and Philosophy of Science",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "General Studies",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE 531",
        "course_unit": "2",
        "course_title": "Work Study and System Design",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE222",
        "course_unit": "2",
        "course_title": "Introduction to Industrial Engineering Techniques",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE321",
        "course_unit": "2",
        "course_title": "Engineering Statistics I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE331",
        "course_unit": "3",
        "course_title": "Introduction to Industrial Engineering",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE341",
        "course_unit": "3",
        "course_title": "Engineering Economics I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE342",
        "course_unit": "3",
        "course_title": "Engineering Economics II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE371",
        "course_unit": "3",
        "course_title": "Project Planning and Control",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE372",
        "course_unit": "2",
        "course_title": "Introduction to computer graphics & drafting",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE381",
        "course_unit": "3",
        "course_title": "Introduction to Systems Engineering",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE392",
        "course_unit": "3",
        "course_title": "Engineering Statistics II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE401",
        "course_unit": "2",
        "course_title": "Industrial Engineering Laboratory ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE411",
        "course_unit": "3",
        "course_title": "Mathematical Methods in Industrial Engineering",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE421",
        "course_unit": "2",
        "course_title": "Research Methodology and Technical Communication",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE431",
        "course_unit": "3",
        "course_title": "Production Management",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE441",
        "course_unit": "2",
        "course_title": "Engineering Accounting",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE451",
        "course_unit": "2",
        "course_title": "Facility Planning and Layout",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE461",
        "course_unit": "3",
        "course_title": "Introduction to Decision Theory and Stochastic Pro",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE473",
        "course_unit": "3",
        "course_title": "Human Factors Engineering ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE481",
        "course_unit": "2",
        "course_title": "Quality Engineering Management",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE511",
        "course_unit": "3",
        "course_title": "Scheduling and Inventory Control",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE512",
        "course_unit": "2",
        "course_title": "Design and Analysis of Industrial Experiments",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE521",
        "course_unit": "3",
        "course_title": "Logistics and Supply Chain Management",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE522",
        "course_unit": "3",
        "course_title": "Engineering Law and Management",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE532",
        "course_unit": "2",
        "course_title": "Introduction to Simulation and Modeling",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE541",
        "course_unit": "3",
        "course_title": "Special Topics in Industrial Engineering I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE542",
        "course_unit": "2",
        "course_title": "Special Topics in Industrial Engineering II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE551",
        "course_unit": "2",
        "course_title": "Computer Applications in Industrial Engineering an",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE552",
        "course_unit": "2",
        "course_title": "Introduction to Reliability and Maintenance",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE561",
        "course_unit": "3",
        "course_title": "Principles of Operations Research I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE562",
        "course_unit": "3",
        "course_title": "Principles of Operations ResearchII",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE563",
        "course_unit": "2",
        "course_title": "Forecasting Techniques",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE564",
        "course_unit": "2",
        "course_title": "Technology Policy and Entrepreneurship",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE572",
        "course_unit": "2",
        "course_title": "Metrology",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "IDE573",
        "course_unit": "2",
        "course_title": "Safety Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Industrial Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE211",
        "course_unit": "3",
        "course_title": "Engineering Mechanics I",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE212",
        "course_unit": "3",
        "course_title": "Engineering Mechanics II",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE221",
        "course_unit": "3",
        "course_title": "Engineering Drawing I",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE222",
        "course_unit": "3",
        "course_title": "Engineering Drawing II",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE311",
        "course_unit": "3",
        "course_title": "Mechanics of Machines I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE311",
        "course_unit": "3",
        "course_title": "Mechanics of Machines I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE312",
        "course_unit": "3",
        "course_title": "Mechanics of Machine II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE312",
        "course_unit": "3",
        "course_title": "Mechanics of Machines II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE312 ",
        "course_unit": "3",
        "course_title": "Mechanics of Machines II ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE321",
        "course_unit": "3",
        "course_title": "Engineering Drawing III",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE321",
        "course_unit": "3",
        "course_title": "Engineering Drawing III",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE322",
        "course_unit": "3",
        "course_title": "Creative Problem Solving",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE332",
        "course_unit": "2",
        "course_title": "Strength of Materials III",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE332 ",
        "course_unit": "2",
        "course_title": "Strength of Materials ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE342",
        "course_unit": "2",
        "course_title": "Materials Science & Production Processes",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE342 ",
        "course_unit": "2",
        "course_title": "Engineering Metallurgy  ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE351",
        "course_unit": "2",
        "course_title": "Thermodynamics I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE351 ",
        "course_unit": "2",
        "course_title": "Thermodynamics I ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE352",
        "course_unit": "2",
        "course_title": "Engineering Thermodynamics II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE361",
        "course_unit": "2",
        "course_title": "Fluid Mechanics I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE361 ",
        "course_unit": "2",
        "course_title": "Fluid Mechanics I ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE362",
        "course_unit": "2",
        "course_title": "Fluid Mechanics II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE362 ",
        "course_unit": "2",
        "course_title": "Fluid Mechanics II ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE372",
        "course_unit": "1",
        "course_title": "Computer Auto Graphics",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE372",
        "course_unit": "2",
        "course_title": "Computer Graphics",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE411 ",
        "course_unit": "3",
        "course_title": "Mechanical Vibrations ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE411",
        "course_unit": "3",
        "course_title": "Mechanics of Machines III",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE421",
        "course_unit": "3",
        "course_title": "Engineering Design",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE431",
        "course_unit": "2",
        "course_title": "Strength  of Materials II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE441",
        "course_unit": "2",
        "course_title": "Metallurgy",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE441",
        "course_unit": "2",
        "course_title": "Metallurgy I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE451",
        "course_unit": "2",
        "course_title": "Thermodynamics III",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE461",
        "course_unit": "3",
        "course_title": "Fluid Mechanics III",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE471",
        "course_unit": "2",
        "course_title": "Heat Transfer",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE471 ",
        "course_unit": "2",
        "course_title": "Heat Transfer  ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE505",
        "course_unit": "2",
        "course_title": "Computer Applications in Mechanical Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE506",
        "course_unit": "2",
        "course_title": "Mechanical Engineering in Industry",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE511",
        "course_unit": "3",
        "course_title": "Systems Dynamics I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE512",
        "course_unit": "3",
        "course_title": "Systems Dynamics II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE521",
        "course_unit": "3",
        "course_title": "Design of Machine Elements",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE522",
        "course_unit": "3",
        "course_title": "Machine Design",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE531",
        "course_unit": "3",
        "course_title": "Stress Analysis I (Optional)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE532",
        "course_unit": "3",
        "course_title": "Advance Strength of Materials (Optional)",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE541",
        "course_unit": "3",
        "course_title": "Metallurgy II (optional)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE542",
        "course_unit": "3",
        "course_title": "Metallurgy III (Optional)",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE551",
        "course_unit": "2",
        "course_title": "Thermal Power Engineering I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE552",
        "course_unit": "2",
        "course_title": "Thermal Power Engineering II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE561",
        "course_unit": "3",
        "course_title": "Fluid Mechanics IV (Optional)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE562",
        "course_unit": "3",
        "course_title": "Fluid Mechanics V (Optional)",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE571",
        "course_unit": "2",
        "course_title": "Heat Transfer II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE572 ",
        "course_unit": "2",
        "course_title": "Refrigeration and Air-Conditioning ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE572",
        "course_unit": "2",
        "course_title": "Refrigeration and Air-conditioning",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE581",
        "course_unit": "3",
        "course_title": "ENGINEERING MAINTENANCE AND RELIABILITY I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE582",
        "course_unit": "3",
        "course_title": "ENGINEERING MAINTENANCE AND RELIABILITY II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE591",
        "course_unit": "3",
        "course_title": "Building Service Engineering I (Optional)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MEE592",
        "course_unit": "3",
        "course_title": "Building Service Engineering II (Optional)",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechanical Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME222",
        "course_unit": "3",
        "course_title": "Material Science",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Material and Metrolo",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME311",
        "course_unit": "3",
        "course_title": "Properties of Materials",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME312 ",
        "course_unit": "2",
        "course_title": "Fuels, Furnances & Refractories",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME321",
        "course_unit": "3",
        "course_title": "Physical Metallurgy I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME322 ",
        "course_unit": "2",
        "course_title": "Polymeric Materials",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME332 ",
        "course_unit": "2",
        "course_title": "Mineral Processing Technology",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME342",
        "course_unit": "2",
        "course_title": "Crystallography",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME352",
        "course_unit": "2",
        "course_title": "Metallurgical Thermodynamics",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME362",
        "course_unit": "2",
        "course_title": "Joining & Welding Technology",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME372",
        "course_unit": "2",
        "course_title": "Solidification & Foundry Technology",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME382",
        "course_unit": "2",
        "course_title": "Biomaterials",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME411 ",
        "course_unit": "2",
        "course_title": "Material Testing &Experimental Techniques",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME421",
        "course_unit": "3",
        "course_title": "Physical Metallurgy II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME431",
        "course_unit": "2",
        "course_title": "Deformation & Fracture Mechanics",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME441",
        "course_unit": "2",
        "course_title": "Technical Report Writing & Communication",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME451",
        "course_unit": "2",
        "course_title": "Chemical Metallurgy",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME461",
        "course_unit": "3",
        "course_title": "Electrochemistry & Corrosion",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME471",
        "course_unit": "2",
        "course_title": "Heat & Mass Transfer  ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME501",
        "course_unit": "3",
        "course_title": "Project ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME502",
        "course_unit": "3",
        "course_title": "Project ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME505",
        "course_unit": "2",
        "course_title": "Computer Aided Design (CAD)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME506",
        "course_unit": "2",
        "course_title": "Materials & Metallurgical Engineering in Industry",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME511",
        "course_unit": "2",
        "course_title": "Iron Steel Technology",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME512",
        "course_unit": "2",
        "course_title": "Non-ferrous Extractive Metallurgy",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME521",
        "course_unit": "2",
        "course_title": "Composite Materials",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME522",
        "course_unit": "2",
        "course_title": "Powder Metallurgy, Ceramics & Glasses",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME531",
        "course_unit": "2",
        "course_title": "Engineering Plasticity",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME532",
        "course_unit": "2",
        "course_title": "Mechanics of Metal Forming",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME541",
        "course_unit": "2",
        "course_title": "Introduction to Nanotechnology",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME542",
        "course_unit": "3",
        "course_title": "Transport Phenomena in Materials Processing",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME551",
        "course_unit": "2",
        "course_title": "Metallurgical Process & Plant Design",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME552",
        "course_unit": "3",
        "course_title": "Failure Analysis & Material Selection",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME561",
        "course_unit": "3",
        "course_title": "Production Metallurgy (Optional)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME562",
        "course_unit": "3",
        "course_title": "Corrosion Management & Control",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME571",
        "course_unit": "3",
        "course_title": "Functional Materials (Optional)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME572",
        "course_unit": "3",
        "course_title": "Foundry Technology II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME581",
        "course_unit": "3",
        "course_title": "Nuclear Materials (Optional)",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MME582",
        "course_unit": "3",
        "course_title": "Rheology",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Metallurgical & Mate",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE212",
        "course_unit": "2",
        "course_title": "Maritime Engineering Practice",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE212 ",
        "course_unit": "2",
        "course_title": "Marine Engineering Practice ",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE321",
        "course_unit": "2",
        "course_title": "Naval Architecture I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE321 ",
        "course_unit": "2",
        "course_title": "Naval Architecture I ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE322",
        "course_unit": "2",
        "course_title": "Metrology",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE322 ",
        "course_unit": "2",
        "course_title": "Metrology ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE332",
        "course_unit": "3",
        "course_title": "Electrical Machines I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE332 ",
        "course_unit": "3",
        "course_title": "Electrical Machines I ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE351",
        "course_unit": "2",
        "course_title": "Introduction  to  Marine  Engine Technologies",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE351 ",
        "course_unit": "2",
        "course_title": "Introduction  to  Marine  Engine Technologies ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE352",
        "course_unit": "2",
        "course_title": "Marine Steam and Gas Turbines",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE352 ",
        "course_unit": "2",
        "course_title": "Marine Steam and Gas Turbines  ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE372",
        "course_unit": "2",
        "course_title": "Navigation and Meteorology",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE372 ",
        "course_unit": "2",
        "course_title": "Navigation and Meteorology ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE381",
        "course_unit": "1",
        "course_title": "Technical  Report  Writing  and  Communication",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE381 ",
        "course_unit": "1",
        "course_title": "Technical  Report  Writing  and  Communication",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE411",
        "course_unit": "3",
        "course_title": "Ship Design I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE411 ",
        "course_unit": "3",
        "course_title": "Ship Design I  ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE421",
        "course_unit": "2",
        "course_title": "Naval Architecture II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE421 ",
        "course_unit": "2",
        "course_title": "Naval Architecture II ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE431",
        "course_unit": "3",
        "course_title": "Ship Structures and Strength",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE431 ",
        "course_unit": "3",
        "course_title": "Ship Structures and Strength ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE461",
        "course_unit": "2",
        "course_title": "Marine Auxiliary Machinery",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE461 ",
        "course_unit": "2",
        "course_title": "Marine Auxiliary Machinery ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE471",
        "course_unit": "2",
        "course_title": "Shipyard Technology I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE471 ",
        "course_unit": "2",
        "course_title": "Shipyard Technology I ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE501 ",
        "course_unit": "3",
        "course_title": "Project ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE502 ",
        "course_unit": "3",
        "course_title": "Project ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE511",
        "course_unit": "3",
        "course_title": "Ship Design II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE511 ",
        "course_unit": "3",
        "course_title": "Ship Design II ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE512 ",
        "course_unit": "3",
        "course_title": "Ship design and Construction ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE521",
        "course_unit": "2",
        "course_title": "Naval Architecture III",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE521 ",
        "course_unit": "2",
        "course_title": "Naval Architecture III  ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE522 ",
        "course_unit": "2",
        "course_title": "Shipyard Technology II ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE531 ",
        "course_unit": "2",
        "course_title": "Running and Maintenance of Ship Power Plants ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE532 ",
        "course_unit": "2",
        "course_title": "Offshore Structures ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE551 ",
        "course_unit": "3",
        "course_title": "Marine Diesel Engine  ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE552 ",
        "course_unit": "3",
        "course_title": "Ship Engines and Power Plants ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE561 ",
        "course_unit": "2",
        "course_title": "Ship Propulsion ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE562 ",
        "course_unit": "2",
        "course_title": "Ship Automation ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MRE571 ",
        "course_unit": "3",
        "course_title": "Marine Operations ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Marine Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE292 ",
        "course_unit": "2",
        "course_title": "Introduction to Mechatronics Engineering ",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE301 ",
        "course_unit": "2",
        "course_title": "Mechatronic Laboratory I ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE302 ",
        "course_unit": "2",
        "course_title": "Mechatronic Laboratory II ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE311 ",
        "course_unit": "3",
        "course_title": "Electrical Circuit Theory ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE312 ",
        "course_unit": "3",
        "course_title": "Electromagnetic Theory ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE321 ",
        "course_unit": "2",
        "course_title": "Signals & Systems ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE322 ",
        "course_unit": "2",
        "course_title": "Electronics I ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE332 ",
        "course_unit": "3",
        "course_title": "Computer Hardware Engineering ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE341 ",
        "course_unit": "2",
        "course_title": "Computer Software Engineering I ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE342 ",
        "course_unit": "3",
        "course_title": "Electromechanical Devices ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE352 ",
        "course_unit": "2",
        "course_title": "Materials Technology ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE362 ",
        "course_unit": "3",
        "course_title": "Mechanical Engineering Design ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE372 ",
        "course_unit": "2",
        "course_title": "Heat & Mass Transfer ",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE381 ",
        "course_unit": "1",
        "course_title": "Technical Writing & Presentation ",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE401 ",
        "course_unit": "2",
        "course_title": "CAD/CAM/CNC Laboratory ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE411 ",
        "course_unit": "2",
        "course_title": "Measurement & Instrumentation ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE421 ",
        "course_unit": "3",
        "course_title": "Electronics II ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE431 ",
        "course_unit": "3",
        "course_title": "Control Engineering I ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE441 ",
        "course_unit": "3",
        "course_title": "Digital Systems & PLCs ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE451 ",
        "course_unit": "2",
        "course_title": "Computer Aided Manufacturing ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE461 ",
        "course_unit": "2",
        "course_title": "Sensors & Actuators ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE491 ",
        "course_unit": "2",
        "course_title": "Group Project ",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE501 ",
        "course_unit": "3",
        "course_title": "Final Year Project ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE502 ",
        "course_unit": "3",
        "course_title": "Final Year Project ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE511 ",
        "course_unit": "3",
        "course_title": "Microcomputers & Microprocessor Systems ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE512 ",
        "course_unit": "3",
        "course_title": "Power Electronics & Drives ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE521 ",
        "course_unit": "3",
        "course_title": "Digital Signal Modelling ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE522 ",
        "course_unit": "3",
        "course_title": "Systems Modelling & Simulation ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE531 ",
        "course_unit": "2",
        "course_title": "Control Engineering II ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE541 ",
        "course_unit": "2",
        "course_title": "Computer Software II ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE551 ",
        "course_unit": "2",
        "course_title": "Introduction to Robotics ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE552 ",
        "course_unit": "3",
        "course_title": "Automation & Robotics ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE561 ",
        "course_unit": "2",
        "course_title": "Vibrations ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE572 ",
        "course_unit": "2",
        "course_title": "Process Automation ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE573 ",
        "course_unit": "2",
        "course_title": "Micro-Fabrication Technology ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE574 ",
        "course_unit": "2",
        "course_title": "Computer Aided Product Modelling ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE575 ",
        "course_unit": "2",
        "course_title": "Machine Vision ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE576 ",
        "course_unit": "2",
        "course_title": "Lean Product Mgt. & Ind. Logistics ",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE582 ",
        "course_unit": "3",
        "course_title": "MEMS & VLSI ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE583 ",
        "course_unit": "2",
        "course_title": "Microcontroller & Embedded Systems ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE584 ",
        "course_unit": "2",
        "course_title": "Control Engineering III ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE585 ",
        "course_unit": "2",
        "course_title": "Mobile Robotics ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE586 ",
        "course_unit": "2",
        "course_title": "Renewable Energy Resources ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTE592 ",
        "course_unit": "2",
        "course_title": "Automation Laboratory ",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTH110",
        "course_unit": "3",
        "course_title": "Algebra & Trigonometry",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Mathematics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTH112",
        "course_unit": "3",
        "course_title": "Calculus",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Mathematics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTH123",
        "course_unit": "3",
        "course_title": "Vectors, Geometry & Statistics",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Mathematics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "MTH125",
        "course_unit": "3",
        "course_title": "Differential Equations & Dynamics",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Mathematics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE211",
        "course_unit": "2",
        "course_title": "Basic Petroleum Engineering",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE212",
        "course_unit": "2",
        "course_title": "Drilling Technology I",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE281",
        "course_unit": "2",
        "course_title": "Engineering Computer Programming",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE311",
        "course_unit": "3",
        "course_title": "Basic Petroleum Engineering",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE322",
        "course_unit": "3",
        "course_title": "Petroleum Geology",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE331",
        "course_unit": "2",
        "course_title": "Well Testing and Analysis",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE332",
        "course_unit": "3",
        "course_title": "Computer Application in Petroleum Engineering",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE342",
        "course_unit": "3",
        "course_title": "Drilling Technology I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE343",
        "course_unit": "3",
        "course_title": "Engineering Geology",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE344",
        "course_unit": "2",
        "course_title": "Reservoir Geomechanics",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE355",
        "course_unit": "2",
        "course_title": "Drilling Fluid Systems and Engineering",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE358",
        "course_unit": "3",
        "course_title": "Formation Evaluation",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE401",
        "course_unit": "2",
        "course_title": "Laboratory V",
        "course_semester": "1",
        "course_level": "0",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE411",
        "course_unit": "2",
        "course_title": "Quality Health Safety and Environment Studies",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE431",
        "course_unit": "2",
        "course_title": "Wall Test Analysis",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE441",
        "course_unit": "3",
        "course_title": "Drilling Technology II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE451",
        "course_unit": "3",
        "course_title": "Well Logging",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE461",
        "course_unit": "3",
        "course_title": "Reservoir Engineering I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE471",
        "course_unit": "3",
        "course_title": "Oil and Gas Production Technology I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE500",
        "course_unit": "6",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE531",
        "course_unit": "3",
        "course_title": "Oil Field Development I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE532",
        "course_unit": "3",
        "course_title": "Oil Field Development II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE561",
        "course_unit": "3",
        "course_title": "Reservoir Engineering II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE562",
        "course_unit": "3",
        "course_title": "Reservoir Engineering III",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE571",
        "course_unit": "3",
        "course_title": "Oil and Gas Production Tech. II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE572",
        "course_unit": "3",
        "course_title": "Oil and Gas Production Technology III",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE581",
        "course_unit": "3",
        "course_title": "Natural gas Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE582",
        "course_unit": "3",
        "course_title": "Natural Gas Processing",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE591",
        "course_unit": "3",
        "course_title": "Numerical Methods",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE592",
        "course_unit": "3",
        "course_title": "Elements of Reservoir Simulation",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PEE593",
        "course_unit": "3",
        "course_title": "Enhanced Oil Recovery Processes",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Petroleum Engineerin",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PHY109",
        "course_unit": "2",
        "course_title": "Practical Physics",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Physics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PHY111",
        "course_unit": "3",
        "course_title": "Mechanics, Thermal Physics & Properties of Matter",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Physics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PHY113",
        "course_unit": "3",
        "course_title": "Vibration, Wave & Optics",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Physics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PHY124",
        "course_unit": "4",
        "course_title": "Electromagnetism & Modern Physics",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Physics",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE211",
        "course_unit": "2",
        "course_title": "Manufacturing Technology I",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE212",
        "course_unit": "2",
        "course_title": "Manufacturing Technology II",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE222",
        "course_unit": "2",
        "course_title": "Introduction to Computer Graphics & Drafting",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE311",
        "course_unit": "2",
        "course_title": "Manufacturing Technology III",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE314",
        "course_unit": "2",
        "course_title": "Industrial Engineering Statistics",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE321",
        "course_unit": "3",
        "course_title": "Production Technology I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE322",
        "course_unit": "2",
        "course_title": "Applied Material Science",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE322",
        "course_unit": "2",
        "course_title": "Applied Material Science",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE332",
        "course_unit": "3",
        "course_title": "Design Of Machine Elements I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE332",
        "course_unit": "3",
        "course_title": "Design of Machine Elements & Material Selection I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE401",
        "course_unit": "2",
        "course_title": "Production Laboratory",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE411",
        "course_unit": "3",
        "course_title": "Mathematical & Methods in Prod Eng.",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE421",
        "course_unit": "3",
        "course_title": "Production Technology II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE431",
        "course_unit": "3",
        "course_title": "Design of Machine Elements II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE441",
        "course_unit": "3",
        "course_title": "Machine Tool Technology I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE451",
        "course_unit": "3",
        "course_title": "Metrology",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE461",
        "course_unit": "3",
        "course_title": "Introduction to Industrial Engineering",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE473",
        "course_unit": "3",
        "course_title": "Human Factors Engineering/Fact. Layout I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE500",
        "course_unit": "6",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE521",
        "course_unit": "3",
        "course_title": "Production Management I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE522",
        "course_unit": "3",
        "course_title": "Production Management II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE531",
        "course_unit": "3",
        "course_title": "Design and Production",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE532",
        "course_unit": "3",
        "course_title": "Tool Design (including jigs & fixtures)",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE541",
        "course_unit": "2",
        "course_title": "Machine Tool Technology II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE551",
        "course_unit": "2",
        "course_title": "Computer Applications in Production Engineering",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE561",
        "course_unit": "2",
        "course_title": "Principles of Operations Research",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE562",
        "course_unit": "2",
        "course_title": "Operations Research II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE564",
        "course_unit": "2",
        "course_title": "Technology Policy & Entrepreneurship",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE571",
        "course_unit": "3",
        "course_title": "Engineering Economics and Administration I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE572",
        "course_unit": "3",
        "course_title": "Engineering Economic and Administration II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE573",
        "course_unit": "2",
        "course_title": "Human Factors Engineering & Factor Layout II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE581",
        "course_unit": "3",
        "course_title": "Automation and Control",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE581",
        "course_unit": "3",
        "course_title": "Automation and Control I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE582",
        "course_unit": "3",
        "course_title": "Automatic and Control II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE591",
        "course_unit": "3",
        "course_title": "Machine Tool Technology",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE592",
        "course_unit": "2",
        "course_title": "Plastic Working of Metals",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "PRE592",
        "course_unit": "3",
        "course_title": "Plastic Working of Metals",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Production Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE311",
        "course_unit": "2",
        "course_title": "Construction Technology",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE312",
        "course_unit": "2",
        "course_title": "Construction Technology II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE313",
        "course_unit": "2",
        "course_title": "Elements of Architecture",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Civil Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE411",
        "course_unit": "2",
        "course_title": "Structural  and Solid Mechanics I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE413",
        "course_unit": "2",
        "course_title": "Design of Concrete and other Structurals  I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE415",
        "course_unit": "2",
        "course_title": "Constructing Technology III",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE417",
        "course_unit": "2",
        "course_title": "Service Engineering I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE425",
        "course_unit": "2",
        "course_title": "Building Construction Materials",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE501",
        "course_unit": "3",
        "course_title": "First Year Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE502",
        "course_unit": "3",
        "course_title": "PROJECT",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE511",
        "course_unit": "2",
        "course_title": "Structural and Solid Mechanics II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE512",
        "course_unit": "2",
        "course_title": "STRUCTURAL AND SOLID MECHANICS III",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE513",
        "course_unit": "2",
        "course_title": "Design of Concrete and Other Structures II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE514",
        "course_unit": "2",
        "course_title": "DESIGN OF REINFORCED CONCRETE AND OTHER STRUCTURES",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE515",
        "course_unit": "3",
        "course_title": "Construction Management and  Technology",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE516",
        "course_unit": "2",
        "course_title": "SERVICES ENGINEERING",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE517",
        "course_unit": "2",
        "course_title": "Building and Civil Engineering Measurement and Eva",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE518",
        "course_unit": "2",
        "course_title": "ACOUSTICS AND MECHANICAL SERVICES IN BUILDING",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE531",
        "course_unit": "3",
        "course_title": "BRIDGE STRUCTURES AND TECHNOLOGY",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE532",
        "course_unit": "3",
        "course_title": "STRUCTURES IN MANSONRY AND OTHER LOCAL MATERIALS",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE533",
        "course_unit": "3",
        "course_title": "AIRCRAFT STRUCTURES AND TECHNOLOGY",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE534",
        "course_unit": "3",
        "course_title": "OFFSHORE STRUCTURES  AND TECHNOLOGY",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE535",
        "course_unit": "3",
        "course_title": "TIMBER STRUCTURES AND TECHNOLOGY",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "STE536",
        "course_unit": "3",
        "course_title": "STEEL STRUCTURES AND TECHNOLOGY",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Structural Engineeri",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "UBT400 ",
        "course_unit": "6",
        "course_title": "SIWES ",
        "course_semester": "2",
        "course_level": "400",
        "Teaching_dept": "Mechatronics Enginee",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "UBT400",
        "course_unit": "6",
        "course_title": "Industrial Training",
        "course_semester": "2",
        "course_level": "400",
        "Teaching_dept": "UBITS",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CCT011",
        "course_unit": "3",
        "course_title": "CCT011",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT012",
        "course_unit": "2",
        "course_title": "CCT012",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT013",
        "course_unit": "3",
        "course_title": "CCT013",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT014",
        "course_unit": "2",
        "course_title": "CCT014",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT015",
        "course_unit": "3",
        "course_title": "CCT015",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT016",
        "course_unit": "3",
        "course_title": "CCT016",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT018",
        "course_unit": "3",
        "course_title": "CCT018",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT021",
        "course_unit": "2",
        "course_title": "CCT021",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT023",
        "course_unit": "3",
        "course_title": "CCT023",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT025",
        "course_unit": "2",
        "course_title": "CCT025",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT027",
        "course_unit": "3",
        "course_title": "CCT027",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT029",
        "course_unit": "3",
        "course_title": "CCT029",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT030",
        "course_unit": "2",
        "course_title": "CCT030",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT032",
        "course_unit": "3",
        "course_title": "CCT032",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT034",
        "course_unit": "3",
        "course_title": "CCT034",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT036",
        "course_unit": "2",
        "course_title": "CCT036",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT038",
        "course_unit": "2",
        "course_title": "CCT038",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT040",
        "course_unit": "3",
        "course_title": "CCT040",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT042",
        "course_unit": "2",
        "course_title": "CCT042",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CCT200",
        "course_unit": "2",
        "course_title": "CCT200",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "",
        "course_order": "0",
        "course_dept_idr": "2",
        "course_faculty_idr": "2"
    },
    {
        "course_code": "CHE211",
        "course_unit": "2",
        "course_title": "Chemistry for Engineers",
        "course_semester": "1",
        "course_level": "200",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE212",
        "course_unit": "2",
        "course_title": "Chemistry for Engineer",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE222",
        "course_unit": "3",
        "course_title": "Materials Science",
        "course_semester": "2",
        "course_level": "200",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE301",
        "course_unit": "2",
        "course_title": "Chemical Engineering Laboratory I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE311",
        "course_unit": "2",
        "course_title": "Chemical Engineering Thermodynamics I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE312",
        "course_unit": "2",
        "course_title": "Computer Application in Chemical Engineering I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE321",
        "course_unit": "3",
        "course_title": "Biochemical Engineering I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE322",
        "course_unit": "3",
        "course_title": "Process Instrumentation and Control",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE331",
        "course_unit": "2",
        "course_title": "Technical Writing and Communication",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE332",
        "course_unit": "3",
        "course_title": "Chemical Reaction Engineering I",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE341",
        "course_unit": "3",
        "course_title": "Industrial Process Calculations",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE351",
        "course_unit": "3",
        "course_title": "Polymer Engineering I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE352",
        "course_unit": "3",
        "course_title": "Heat Transfer",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE361",
        "course_unit": "3",
        "course_title": "Fluid Flow for Chemical Engineers",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE362",
        "course_unit": "3",
        "course_title": "Mass Transfer",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE372",
        "course_unit": "3",
        "course_title": "Particle Technology",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE401",
        "course_unit": "2",
        "course_title": "Chemical Engineering Laboratory II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE411",
        "course_unit": "2",
        "course_title": "Chemical Engineering Thermodynamics II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE421",
        "course_unit": "3",
        "course_title": "Chemical Engineering Analysis I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE431",
        "course_unit": "3",
        "course_title": "Process Design I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE441",
        "course_unit": "3",
        "course_title": "Petroleum Refinery Processes",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE451",
        "course_unit": "3",
        "course_title": "Seperation Processes I",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE461",
        "course_unit": "3",
        "course_title": "Separation Processes II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE471",
        "course_unit": "2",
        "course_title": "Chemical Reaction Engineering II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE481",
        "course_unit": "2",
        "course_title": "Computer Application in Chemical Engineering II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE500",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE500",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE511",
        "course_unit": "2",
        "course_title": "Process Dynamics, Optimization and Control I",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE512",
        "course_unit": "2",
        "course_title": "Process Dynamics, Optimization and Control II",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE521",
        "course_unit": "2",
        "course_title": "Chemical Engineering Analysis II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE522",
        "course_unit": "3",
        "course_title": "Loss Prevention and Industrial Safety",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE531",
        "course_unit": "3",
        "course_title": "Process Design II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE532",
        "course_unit": "3",
        "course_title": "Process Design III",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE541",
        "course_unit": "2",
        "course_title": "Separation Process III",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE542",
        "course_unit": "3",
        "course_title": "Corrosion  Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE552",
        "course_unit": "3",
        "course_title": " Reservoir  Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE561",
        "course_unit": "2",
        "course_title": "Chemical Reaction Engineering III",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE562",
        "course_unit": "3",
        "course_title": "Chemical Reaction Engineering IV",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE571",
        "course_unit": "3",
        "course_title": "Biochemical Engineering II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE581",
        "course_unit": "3",
        "course_title": "Chemical Process Industries",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHE591",
        "course_unit": "3",
        "course_title": "Polymer Engineering II",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Chemical Engineering",
        "course_order": "0",
        "course_dept_idr": "9",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHM111",
        "course_unit": "3",
        "course_title": "Inorganic Chemistry I",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Chemistry",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHM113",
        "course_unit": "3",
        "course_title": "Organic Chemistry I",
        "course_semester": "1",
        "course_level": "100",
        "Teaching_dept": "Chemistry",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHM122",
        "course_unit": "3",
        "course_title": "Inorganic Chemistry II",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Chemistry",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CHM124",
        "course_unit": "3",
        "course_title": "Organic Chemistry II",
        "course_semester": "2",
        "course_level": "100",
        "Teaching_dept": "Chemistry",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE300",
        "course_unit": "3",
        "course_title": "Computer Lab",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE311",
        "course_unit": "3",
        "course_title": "Electrical Theory I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE312",
        "course_unit": "3",
        "course_title": "Electrical Theory II",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE313",
        "course_unit": "2",
        "course_title": "Electrical/Electronic Measurement",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE314",
        "course_unit": "3",
        "course_title": "Electromagnetic Theory",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE316",
        "course_unit": "3",
        "course_title": "Properties of Semiconductor Materials",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE321",
        "course_unit": "2",
        "course_title": "Commercial  Programming Language",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE322",
        "course_unit": "3",
        "course_title": "High Level Programming",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE371",
        "course_unit": "3",
        "course_title": "Logic Design and Switching Theory",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE372",
        "course_unit": "3",
        "course_title": "Digital Electronics Circuits",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE375",
        "course_unit": "3",
        "course_title": "Computer Architecture and Organization I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE376",
        "course_unit": "3",
        "course_title": "Basic Computer Engineering",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE377",
        "course_unit": "3",
        "course_title": "Micro-Computer Tech I",
        "course_semester": "1",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE378",
        "course_unit": "3",
        "course_title": "Microprocessor  and Micro-computer",
        "course_semester": "2",
        "course_level": "300",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE423",
        "course_unit": "3",
        "course_title": "Operating System/Principles",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE451",
        "course_unit": "3",
        "course_title": "Control Theory",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE457",
        "course_unit": "3",
        "course_title": "Assembly Language Programming",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE471",
        "course_unit": "2",
        "course_title": "Instrumentation/Electronic Circuits",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE473",
        "course_unit": "3",
        "course_title": "Telecoms Principles",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE475",
        "course_unit": "3",
        "course_title": "Computer Architecture & Organization II",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE477",
        "course_unit": "3",
        "course_title": "Semiconductor Material Technology",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE481",
        "course_unit": "3",
        "course_title": "Numerical Computer",
        "course_semester": "1",
        "course_level": "400",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE500",
        "course_unit": "6",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE501",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE502",
        "course_unit": "3",
        "course_title": "Project",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE512",
        "course_unit": "3",
        "course_title": "Digital Design Processing",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE522",
        "course_unit": "3",
        "course_title": "System Programming",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE534",
        "course_unit": "3",
        "course_title": "Commercial Programming Languages",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE552",
        "course_unit": "3",
        "course_title": "Control Engineering",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE553",
        "course_unit": "3",
        "course_title": "Microcomputer Technology",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE554",
        "course_unit": "3",
        "course_title": "Data Communications",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE556",
        "course_unit": "3",
        "course_title": "Computer Graphics",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE557",
        "course_unit": "2",
        "course_title": "Engineering Law",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE593",
        "course_unit": "3",
        "course_title": "Artificial Neural Networks",
        "course_semester": "1",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "1",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE572",
        "course_unit": "3",
        "course_title": "Digital Computer Network",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    },
    {
        "course_code": "CPE516",
        "course_unit": "3",
        "course_title": "Computer Security Techniques",
        "course_semester": "2",
        "course_level": "500",
        "Teaching_dept": "Computer Engineering",
        "course_order": "0",
        "course_dept_idr": "0",
        "course_faculty_idr": "1"
    }
]