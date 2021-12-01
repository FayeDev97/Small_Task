document.onreadystatechange = function(){
    if (document.readyState === 'complete'){
        // INITIALIZE APP AFTER DOCUMENT LOADING IS COMPLETED
        initApp();
    }
}
// APP INITIALISATION
function initApp(){
    // CookieStore is only available on https context
    // csrf_token= Window.CookieStore.get('csrftoken');
    // const csrf_token = getCookie('csrftoken');

    // BTNs DEFINITION
    let delete_btns = getBtns('delete-btn');
    let add_btn = document.getElementById('add_btn');
    let task_elems = getBtns('task-text');
    let update_btns = getBtns('update-btn');
    let complete_btns = getBtns('complete-btn');

    //Update listeners
    listener_delete(delete_btns);
    listener_add(add_btn);
    listener_form_toggle(task_elems);
    listener_update(update_btns);
    listener_complete(complete_btns);
}

// MISC FUNCTIONS
    // RETURNS A COOKIE
function getCookie(name){
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
    // CONVERTS ELEMENT CLASS OBJECTS TO OBJECT CLASS OBJECT
function elem_to_obj(task_elem)
{
    return {
        id: task_elem.id,
        text: task_elem.innerHTML
    };
}
    // TOGGLES UPDATE FORM
function toggle_update_form(task_elem){
    const parent = task_elem.parentElement;
    const form = parent.nextElementSibling;
    if(!parent.classList.contains('d-none'))
    {
        form.firstElementChild.value = task_elem.innerHTML;
    }else
    {
        task_elem.innerHTML = form.firstElementChild.value;
    }
    parent.classList.toggle('d-none');
    form.classList.toggle('d-none');
}
    // RETURNS A LIST OF BTN ELEMENTS
function getBtns(className){
    return document.getElementsByClassName(className)
}
function update_listners(){}
// Request handling
async function add_task(task_obj={}){
    let url= 'task/';
    const response= await fetch(url,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(task_obj)
    });
    return response.text();
}
async function update_task(task_obj){
    let url= 'task/'+task_obj.id+'/';
    const response= await fetch(url,{
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken':getCookie('csrftoken')
        },
        body: JSON.stringify(task_obj)
    });
}
async function delete_task(task_id){
    let url = 'task/'+task_id+'/delete';
    const response= await fetch(url,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':getCookie('csrftoken')
        },
        body: null
    });
    ui_remove_task(task_id);
    return response.text();
}
async function update_complete(task_id){
    let url = 'task/'+task_id+'/complete'
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    });
    // return response.text();
}
// Event listening

// adds delete event listener to a list of btn
function listener_delete(btn_list){
    for (let index = 0; index < btn_list.length; index++) {
        const btn = btn_list[index];
        btn.addEventListener('click',function(event){
            delete_task(this.previousElementSibling.id).then(data=>{
                console.log(JSON.parse(data).msg);
            })
        });
    }
}
function listener_add(add_btn){
    add_btn.addEventListener('click', function(event){
        let task = {'text': this.previousElementSibling.value};
        add_task(task).then(json_response=>{
            let data = JSON.parse(json_response);
            ui_add_task(data.task);
            console.log(data.msg);
        })
    });
}
function listener_form_toggle(task_elems){
    for (let index = 0; index < task_elems.length; index++) {
        const task_elem = task_elems[index];
        task_elem.addEventListener('dblclick', function(event){
            const task_obj = elem_to_obj(task_elem);
            toggle_update_form(task_elem);
            // update_task(task_obj);
            // ui_update_task(task_obj);
        });
    }
}
function listener_update(update_btns){
    // task_texts= document.getElementsByClassName(task_text);
    for (let index = 0; index < update_btns.length; index++) {
        const update_btn = update_btns[index];
        update_btn.addEventListener('click', function(event){
            const task_elem = update_btn.parentElement.previousElementSibling.firstElementChild.nextElementSibling;
            if(task_elem.innerHTML === update_btn.previousElementSibling.value){
                toggle_update_form(task_elem);
                return
            }
            //update_task shouldn't be depending on toggle_update_form : fix it
            toggle_update_form(task_elem);
            update_task(elem_to_obj(task_elem));
            // ui_update_task(task_obj);
        });
    }
}
function listener_complete(complete_btns){
    for (let index = 0; index < complete_btns.length; index++) {
        const complete_btn = complete_btns[index];
        complete_btn.addEventListener('click',function(event){
            update_complete(complete_btn.nextElementSibling.id);
        });
        
    }
}
// UI updates functions
    // Add task to on going task container
function ui_add_task(task_obj){
    // Init elements
    let container = document.getElementById('on_going_task_container');
    let li = document.createElement('li');
    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    let a = document.createElement('a');
    let div = document.createElement('div');
    let input1 = document.createElement('input');
    let input2 = document.createElement('input');

    // Adding classes to elements
    li.classList.add('task', 'd-flex', 'justify-content-between', 'align-items-center', 'rounded', 'm-3', 'my-2', 'd-flex');
    span1.classList.add('complete-btn', 'd-block', 'border', 'border-success', 'text-center', 'm-0', 'py-3', 'px-2', 'col-1');
    span2.classList.add('delete-btn', 'd-block', 'border', 'border-danger', 'text-center', 'm-0', 'py-3', 'px-2', 'col-1');
    a.classList.add('task-text', 'd-block', 'text-black', 'text-decoration-none', 'p-3', 'col-10');
    div.classList.add('d-none', 'justify-content-between' ,'align-items-center' ,'rounded' ,'m-3', 'my-2', 'd-flex');
    input1.classList.add('form-control', 'p-3', 'col-101');
    input2.classList.add('update-btn', 'form-control-s', 'text-white', 'bg-success', 'rounded', 'p-3', 'px-5', 'ms-2', 'my-1');
 
    // Adding attributes to elements
    span1.innerText = '✔';
    span2.innerText = '❌';
    a.setAttribute('href','http://');
    a.setAttribute('id',task_obj.id);
    a.innerText = task_obj.text;
    input1.setAttribute('type','text');
    input1.setAttribute('name',task_obj.text);
    input2.setAttribute('type','text');
    input2.setAttribute('name',task_obj.text);
    
    // Adding event listener to elements
    listener_complete([span1]);
    listener_delete([span2]);
    listener_form_toggle([a]);
    listener_update([input2]);

    // Appending elements to parent node
    li.append(span1);
    li.append(a);
    li.append(span2);
    div.append(input1);
    div.append(input2);

    // append new task to ongoing tasks
    container.append(li);
    container.append(div);
    return;
}
    // remove task from on going task container 
function ui_remove_task(task_obj){
    let container = document.getElementById(task_obj).parentElement;
    container.remove();
    return;
}
    // move task from completed to on going and vice versa
function ui_complete_task(task_obj){
    let origin_container;
    let destination_container;
    if (task_obj.completed){
        origin_container = document.getElementById('completed_task_container');
        destination_container = document.getElementById('on_going_task_container');

    }else
    {
        destination_container = document.getElementById('completed_task_container');
        origin_container = document.getElementById('on_going_task_container');
    }
    // Remove task from origin container
    // Toggle appropriate classes
    // Add task to destination container
}
    // Notifications