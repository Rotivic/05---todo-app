import html from "./app.html?raw";
import todoStore, { Filters } from '../store/todo.store';
import { renderPending, renderTodos } from "./use-cases";


const ElementsIDs = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompleted: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos(ElementsIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementsIDs.PendingCountLabel);
    }

    // Cuando App() se llama
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    // Referencias HTML
    const newDescriptionInput = document.querySelector( ElementsIDs.NewTodoInput );
    const todoListUL = document.querySelector( ElementsIDs.TodoList );
    const clearCompletedButton = document.querySelector( ElementsIDs.ClearCompleted );
    const filtersLIs = document.querySelectorAll( ElementsIDs.TodoFilters );

    // Listeners
    newDescriptionInput.addEventListener('keyup', ( event ) => {
        if( event.keyCode !== 13 ) return;
        if( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );     
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', ( event ) => {
        // if(event.target.getAttribute('class') === 'destroy'){
        if(event.target.className === 'destroy'){
            const element  = event.target.closest('[data-id]');
            todoStore.deleteTodo( element.getAttribute('data-id') );
            displayTodos();
        }else{
            const element  = event.target.closest('[data-id]');
            todoStore.toggleTodo( element.getAttribute('data-id') );
            displayTodos();
        }
        
    });

    clearCompletedButton.addEventListener( 'click', (event) => {

        todoStore.deleteDoneTodo();
        displayTodos();

    });

    filtersLIs.forEach( element => {
        element.addEventListener( 'click', (event) =>{
            filtersLIs.forEach( el => el.classList.remove('selected') );
            event.target.classList.add('selected');
            console.log(event.target.text)
            switch ( event.target.text ) {
                case 'Todos':
                    todoStore.setFilter( Filters.All );
                    break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending );
                    break;    
                case 'Completados':
                    todoStore.setFilter( Filters.Completed );
                    break;    

                default:
                    todoStore.setFilter( Filters.All );
                    break;
            }
            displayTodos();

        });
    });
}