const studentApi="http://localhost:3000/student";
var checkClickEdit="none";
var idStudent;
fetch(studentApi)
.then(function(response){
    return response.json();
})
.then(function(students){
    let placeholder=document.querySelector("#data-table-body");
    let out="";
    for(let student of students){
        out+=`
            <tr>
                <td><input type="checkbox" class="form-check" value="${student.id}">
                <td>${student.name}</td>
                <td>${student.birthday}</td>
                <td>${student.phoneNumber}</td>
                <td>${student.hometown}</td>
            </tr>
        `;
    }
    placeholder.innerHTML=out;
})



$("#sub").click(function () {
    document.getElementById("myForm").addEventListener("submit", function (event) {
        event.preventDefault(); 
        // check Validate input fields
        validateInput();
        var checkData=true;
        // lấy data
        var dataForm={};
        var formData=$("#myForm").serializeArray();
        $.each(formData,function(i,v){
            if(v.value!=''){
                dataForm[""+v.name+""]=v.value;
            }else{
                checkData=false;
            }
        })
        if(checkData){ // form khác rỗng thì ta mới gửi
            if(checkClickEdit=="clicked"){ // nếu edit đc click thì hành động save sẽ là sửa ngc lại là thêm
                fetch(studentApi+"/"+idStudent, {
                    method: "PUT", 
                    headers: {
                        "Content-Type": "application/json"  
                    },
                    body: JSON.stringify(dataForm) 
                    })
                    .then(response => {
                        if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Student data added successfully:", data);
                    })
                    .catch(error => {
                        console.error("Error adding student data:", error);
                    });
                    checkClickEdit=="none";
            }
            else{
                fetch(studentApi, {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"  
                    },
                    body: JSON.stringify(dataForm) 
                    })
                    .then(response => {
                        if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json(); 
                    })
                    .then(data => {
                        console.log("Student data added successfully:", data);
                    })
                    .catch(error => {
                        console.error("Error adding student data:", error);
                    });
            }
            
        }
    });
});

function validateInput(){ // check field rỗng
    let formElement=document.getElementById("myForm");
    let inputElements=formElement.querySelectorAll(".form-control");
    for(let i=0;i<inputElements.length;i++){
        console.log(inputElements[i].value);
        if(inputElements[i].value===""){
            inputElements[i].parentElement.querySelector(".error-massage").innerHTML=`Please enter your ${inputElements[i].id}`;
        }else{
            inputElements[i].parentElement.querySelector(".error-massage").innerText="";
        }
    }
    console.log(inputElements);
}

// delete
$("#delete").click(function () {
    // lấy những thằng có checkbox đc tích
    const checkedBoxes = document.querySelectorAll('tr input[type="checkbox"]:checked');
    // Check if any checkbox is selected
    if (!checkedBoxes.length) {
      alert("Please select at least one record to delete.");
      return;
    }
  
    // duyệt
    checkedBoxes.forEach(checkbox => {
        const recordId = checkbox.value;
  
      fetch(`${studentApi}/${recordId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            console.log("Record deleted successfully:", recordId);
            //xóa
            const row = checkbox.closest('tr');
            row.remove();
          } else {
            console.error("Error deleting record:", response.status);
            alert("Error deleting record. Please try again.");
          }
        })
        .catch(error => {
          console.error("Error during deletion:", error);
          alert("Error deleting record. Please try again.");
        });
    });
  });


$("#edit").click(function(){
    checkClickEdit="clicked"
    const checkedBoxes = document.querySelectorAll('tr input[type="checkbox"]:checked');
    if (checkedBoxes.length>1) {
        alert("You can only edit the information of 1 student !");
        return;
    }else if(checkedBoxes.length==0){
        alert("Please select one student to edit !");
        return;
    }
    
    fetch(studentApi+"/"+checkedBoxes[0].value)
    .then(function(response){
        return response.json();
    })
    .then(function(student){
        document.getElementById("name").value=student.name
        document.getElementById("birth").value=student.birthday
        document.getElementById("phone").value=student.phoneNumber
        document.getElementById("hometown").value=student.hometown
        idStudent=student.id;
    })

})