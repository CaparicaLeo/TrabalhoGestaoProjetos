document.addEventListener('DOMContentLoaded', () => {
    // Selecionando os elementos do DOM
    const todoForm = document.querySelector('form');
    const todoInput = document.getElementById('todo-input');
    const descricaoInput = document.getElementById('descricao-todo');
    const todoList = document.getElementById('todo-list');
    const todoBtn = document.getElementById('todo-btn');

    // Carregar tarefas salvas do localStorage
    carregarTarefas();

    // Prevenir o comportamento padrão do formulário e adicionar tarefa
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        adicionarTarefa();
    });

    function adicionarTarefa() {
        // Obter valores dos campos
        const tituloTarefa = todoInput.value.trim();
        const descricaoTarefa = descricaoInput.value.trim();

        // Verificar se o título não está vazio
        if (tituloTarefa === '') {
            alert('Por favor, digite o título da tarefa!');
            return;
        }

        // Criar uma nova tarefa
        const novaTarefa = {
            id: Date.now(), // Usar timestamp como ID único
            titulo: tituloTarefa,
            descricao: descricaoTarefa,
            concluida: false,
            dataCriacao: new Date().toLocaleString()
        };

        // Adicionar à lista visual
        criarElementoTarefa(novaTarefa);

        // Salvar no localStorage
        salvarTarefa(novaTarefa);

        // Limpar os campos do formulário
        todoInput.value = '';
        descricaoInput.value = '';
        todoInput.focus();
    }

    function criarElementoTarefa(tarefa) {
        // Criar elemento li para a tarefa
        const todoItem = document.createElement('li');
        todoItem.dataset.id = tarefa.id;
        todoItem.className = tarefa.concluida ? 'concluida' : '';

        // Conteúdo da tarefa
        const todoConteudo = document.createElement('div');
        todoConteudo.className = 'todo-conteudo';

        // Título da tarefa
        const todoTitulo = document.createElement('h3');
        todoTitulo.textContent = tarefa.titulo;

        // Descrição da tarefa
        const todoDescricao = document.createElement('p');
        todoDescricao.textContent = tarefa.descricao || 'Sem descrição';
        
        // Data de criação
        const todoData = document.createElement('small');
        todoData.textContent = `Criada em: ${tarefa.dataCriacao}`;

        // Adicionar título, descrição e data ao conteúdo
        todoConteudo.appendChild(todoTitulo);
        todoConteudo.appendChild(todoDescricao);
        todoConteudo.appendChild(todoData);

        // Botões de ação
        const acoes = document.createElement('div');
        acoes.className = 'acoes';

        // Botão concluir
        const btnConcluir = document.createElement('button');
        btnConcluir.innerHTML = '✓';
        btnConcluir.className = 'btn-concluir';
        btnConcluir.title = 'Marcar como concluída';
        btnConcluir.addEventListener('click', () => marcarConcluida(tarefa.id));

        // Botão excluir
        const btnExcluir = document.createElement('button');
        btnExcluir.innerHTML = '×';
        btnExcluir.className = 'btn-excluir';
        btnExcluir.title = 'Excluir tarefa';
        btnExcluir.addEventListener('click', () => excluirTarefa(tarefa.id));

        // Adicionar botões às ações
        acoes.appendChild(btnConcluir);
        acoes.appendChild(btnExcluir);

        // Montar o item da lista
        todoItem.appendChild(todoConteudo);
        todoItem.appendChild(acoes);

        // Adicionar o item à lista
        todoList.appendChild(todoItem);
    }

    function marcarConcluida(id) {
        // Obter tarefas do localStorage
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        
        // Encontrar e atualizar a tarefa no array
        tarefas = tarefas.map(tarefa => {
            if (tarefa.id === id) {
                tarefa.concluida = !tarefa.concluida;
            }
            return tarefa;
        });

        // Salvar no localStorage
        localStorage.setItem('tarefas', JSON.stringify(tarefas));

        // Atualizar interface
        const todoItem = document.querySelector(`li[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.toggle('concluida');
        }
    }

    function excluirTarefa(id) {
        // Confirmar exclusão
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
            return;
        }

        // Obter tarefas do localStorage
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        
        // Filtrar a tarefa a ser removida
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);

        // Salvar no localStorage
        localStorage.setItem('tarefas', JSON.stringify(tarefas));

        // Remover da interface
        const todoItem = document.querySelector(`li[data-id="${id}"]`);
        if (todoItem) {
            todoItem.remove();
        }
    }

    function salvarTarefa(tarefa) {
        // Obter tarefas existentes
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        
        // Adicionar nova tarefa
        tarefas.push(tarefa);
        
        // Salvar no localStorage
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function carregarTarefas() {
        // Limpar a lista visual
        todoList.innerHTML = '';
        
        // Obter tarefas do localStorage
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        
        // Adicionar cada tarefa à interface
        tarefas.forEach(tarefa => {
            criarElementoTarefa(tarefa);
        });
    }
});
