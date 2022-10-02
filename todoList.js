const InputContent = document.querySelector("input");
const AddBtn = document.querySelector("#addTask");
const created = document.querySelector("#taskContainer")


AddBtn.addEventListener("click",function(){
    
    let NewDivision = document.createElement("div");
    NewDivision.classList.add("taskStyle");


    let li = document.createElement("li");
    li.classList.add("listStyle");
    li.innerText = InputContent.value;
    NewDivision.append(li);


    let checkBtn = document.createElement("button");
    checkBtn.innerHTML ="check"
    checkBtn.classList.add("checkBtn");
    NewDivision.append(checkBtn);


    let deletBtn = document.createElement("button");
    deletBtn.classList.add("deletBtn");
    deletBtn.innerText = "delet";
    NewDivision.append(deletBtn);

    if(InputContent.value === ""){
        alert("please try to add something!!!"); 
    }
    else{
        created.prepend(NewDivision);
    }
    InputContent.value = ""






    // functionality of checking button

    let checking = "notChecked"
    checkBtn.addEventListener("click", function(){
        if (checking === "notChecked"){
            li.classList.add("checked");
            checkBtn.innerText = "done"
            checking = "checked"
        }
        else{
            li.classList.remove("checked")
            checkBtn.innerText = "check"
            checking = "notChecked"
        }
    })


    // functionality of delet button
    deletBtn.addEventListener("click",function(){
        NewDivision.remove()
    })

})

