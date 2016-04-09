/**
 * Created by Vinea on 04.03.16.
 */
function AppComponent() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;

    var i_style = [];
    this.checkDate = () => {
        request('http://localhost:3000/list/', 'GET', null, (list) => {
            this.list = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].date == today) {
                console.log("today: " + i);
                i_style.push(i);

            }
        }
    });
}
this.todos = [];
this.addTodo = function($event, todo, date) {
    $event.preventDefault();
    if (todo.value == '') {
        return;
    }
    var todoItem = {};
    this.checkDate();
    if (date.value == today) {
        todoItem = {
            item: todo.value,
            date: date.value,
            class: "today"
        };

    } else {
        todoItem = {
            item: todo.value,
            date: date.value
        };

    }
    todo.value = null;
    date.value = null;
    request('http://localhost:3000/list/', 'POST', JSON.stringify(todoItem), this.viewTodo);

}

this.viewTodo = () => {
    this.checkDate();
    request('http://localhost:3000/list/', 'GET', null, (list, style) => {
        this.list = [];
    for (var i = 0; i < list.length; i++) {
        this.todos[i] = {
            id: list[i].id,
            item: list[i].item,
            date: list[i].date
        };
        for (var j = 0; j < list.length; j++)
            if (i == i_style[j]) {
                this.todos[i] = {
                    id: list[i].id,
                    class: "today",
                    item: list[i].item,
                    date: list[i].date

                }
            }
    }
});

}
this.viewTodo();
// this.checkDate();

this.remove = function(item) {
    this.item = item;
    //this.checkDate();
    request('http://localhost:3000/list/' + item.id, 'DELETE', null, this.viewTodo);

}

}

function request(url, type, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
    xhr.addEventListener("load", function() {
        if (xhr.status === 404) {
            document.innerHTML = xhr.status + ': ' + xhr.statusText;
        } else {
            if (callback) {
                callback(JSON.parse(xhr.responseText));
            }
        }
    });

}



AppComponent.annotations = [
    new angular.ComponentAnnotation({
        selector: 'list'
    }),
    new angular.ViewAnnotation({
        template: '<h3>TODO</h3>' +
            '<ol>' +
            '<li (click)="remove(todo)" *ng-for="#todo of todos" *ng-for="#date of todos"> <span id= {{todo.class}}> {{ todo.item }}  <span class="date">{{ todo.date }}</span></span> </li>' +
            '</ol>' +
            '<form (submit)="addTodo($event, todotext, tododate)"><input #todotext placeholder="What to do..."><input type="date" #tododate placeholder="When to do..."><br/><button>ADD</button></form>',
        directives: [angular.NgFor]
    })
];

document.addEventListener('DOMContentLoaded', function() {
    angular.bootstrap(AppComponent);
});