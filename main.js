/**
 * Created by Vinea on 04.03.16.
 */
function AppComponent() {
    this.todos = [];
    this.addTodo = function($event, todo, date) {
        $event.preventDefault();
        if(todo.value == '') {
            return;
        }
        var todoItem ={
            item: todo.value,
            date: date.value
        };
        todo.value = null;
        date.value = null;
        request('http://localhost:3000/list/', 'POST', JSON.stringify(todoItem), this.viewTodo);
    }
    this.viewTodo = () => {
        request('http://localhost:3000/list/', 'GET', null, (list) => {
            this.todos = [];
            for(var i = 0; i < list.length; i++){
               this.todos[i] = {
                   item: list[i].item
                }
            }
        });
    }
    this.viewTodo();

    function request(url, type, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
        xhr.addEventListener("load", function () {
            if (xhr.status === 404) {
                document.innerHTML = xhr.status + ': ' + xhr.statusText;
            } else {
                if(callback) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
        });
    }

    function remove() {
        this.style.opacity = "50%";
    }
}


AppComponent.annotations = [
    new angular.ComponentAnnotation({
        selector: 'div'
    }),
    new angular.ViewAnnotation({
        template: '<h3>TODO</h3>' +
            '<ol>' +
            '<li onclick="this.remove()" *ng-for="#todo of todos">{{ todo.item }} <span *ng-for="#date of todos">  {{ todo.date }}</span></li>' +
            '</ol>' +
            '<form (submit)="addTodo($event, todotext, tododate)"><input #todotext placeholder="What to do..."><input type="date" #tododate placeholder="When to do..."><br/><button>ADD</button></form>',
        directives: [angular.NgFor]
    })
];

document.addEventListener('DOMContentLoaded', function() {
    angular.bootstrap(AppComponent);
});

