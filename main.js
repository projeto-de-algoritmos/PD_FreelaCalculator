// Link do repositório para o link de informações
const repoUrl = 'https://github.com/projeto-de-algoritmos/PD_FreelaCalculator';
let horasDisponiveis = 0;

// Todas as tasks cadastradas
const tasks = new TaskList();
const tarefasSelecionadas = new TaskList();

// Id dos elementos [Atualizar sempre que alterar no HTML]
const elementsId = {
  form: 'form',
  nome: 'nome',
  duracao: 'duracao',
  preco: 'preco',
  divTaskList: 'taskList',
  horasDisponiveis: 'horasDisponiveis'
};

function getFormValue() {
  const formValue = {};
  for (x of document.getElementById('form')) {
    formValue[x.id] = x.value;
  }
  return formValue;
}

function getInfoProjeto() {
  alert('Esse projeto visa organizar os trabalhos de freelancers maximizando o valor recebido,  \
  usando o algoritmo da mochila (knapsack) com pesos, onde cada peso é a quantidade de horas para \
   realizar uma tarefa.');
  return false;
}

function limpaForm(){
  document.getElementById('nome').value ='';
  document.getElementById('duracao').value = '';
  document.getElementById('preco').value = '';
}

function addTask() {
  const formValue = getFormValue();
  if (validaForm(formValue)) {
    tasks.add(formValue);
    horasDisponiveis = formValue['horasDisponiveis']
    renderTasks(steps[1]);
    limpaForm();
  }
  return false;
}




// Organiza as tarefas que devem ser feitas
function scheduleTasks() {
  
  if (tasks.length == 0) {
    alert("Insira ao menos uma tarefa.")
    return false;
  }

  knapsack();

  // Mostrar tarefas selecionadas
  renderTasks(steps[2]);

}


const tableIds =
{
  'lista': {
    id: 'taskList',
    headers: ['nome', 'duracao', 'preco'],
  },
  'selecionadas': {
    id: 'selecionadas',
    headers: ['nome', 'duracao', 'preco'],
  },
};

const steps = ['no_tasks', 'list_tasks', 'list_schedule'];


function deleteTask(id) {
  if (confirm('Deletar tarefa: ' + tasks[id].toString() + '?')) {
    tasks.remove(id);
  }
}


function renderTasks(step) {
  
  if (tasks.length <= 0) {
    return false;
  }

  if (step == steps[0]) {
    document.getElementById(tableIds['lista'].id).innerHTML = '';
    document.getElementById(tableIds['selecionadas'].id).innerHTML = '';
  }
  if (step == steps[1]) {
    document.getElementById('no-task-div')?.remove();
    document.getElementById('btn-agendar').disabled = false;
    document.getElementById('horasDisponiveis').disabled = false;
    document.getElementById(tableIds['lista'].id).innerHTML = tasks.toTable(tableIds['lista'].headers, 'table_tasks', true);
  }
  if (step == steps[2]) {
    
    document.getElementById(tableIds['lista'].id).innerHTML = tasks.toTable(tableIds['lista'].headers);
    // document.getElementById(tableIds['selecionadas'].id).innerHTML = tarefasSelecionadas.toTable(tableIds['selecionadas'].headers);
    let duracaoTotal = 0
    let precoTotal = 0
    tarefasSelecionadas.forEach(t => {
      duracaoTotal += t.duracao;
      precoTotal += t.preco;
    })
    tarefasSelecionadas.push(new Task({nome: 'Total', duracao: duracaoTotal, preco:precoTotal}))

    
    document.getElementById(tableIds['selecionadas'].id).innerHTML = tarefasSelecionadas.toTable(['nome', 'duracao', 'preco'], 'table_selected', false)
    
  }
}


function validaForm(formValue) {
  if (!validaNome(formValue)) {
    return false;
  }

  if (!validaDuracao(formValue)) {
    return false;
  }

  if (!validaPreco(formValue)) {
    return false;
  }

  if (!validaHorasDisponiveis(formValue)) {
    return false;
  }

  return true;
}


function validaPreco(formValue) {
  const preco = formValue[elementsId['preco']];
  if (!preco) {
    fieldError('Preço');
    return false;
  }
  if (isNaN(preco)) {
    fieldError('Preço', 'Insira apenas números. Use ponto para separar as casas decimais.');
    return false;
  }
  return true;
}



function validaHorasDisponiveis(formValue) {
  const horasDisponiveis = formValue[elementsId['horasDisponiveis']];
  if (!horasDisponiveis) {
    fieldError('Horas Disponíveis');
    return false;
  }
  if (isNaN(horasDisponiveis)) {
    fieldError('Horas Disponíveis', 'Insira apenas números. Use ponto para separar as casas decimais.');
    return false;
  }
  return true;
}

function validaNome(formValue) {
  const MAX_NOME = 50;
  const nome = formValue[elementsId['nome']];

  if (!nome) {
    fieldError('Nome da tarefa');
    return false;
  }
  if (nome.length > MAX_NOME || nome.length == 0) {
    fieldError('Nome da tarefa', `Insira nomes entre 0 e ${MAX_NOME} caracteres.`);
    return false;
  }
  return true;
}

function validaDuracao(formValue) {
  const duracao = formValue[elementsId['duracao']];
  if (!duracao) {
    fieldError('Duração');
    return false;
  }
  if (isNaN(duracao)) {
    fieldError('Duração', 'Insira apenas números. Use ponto para separar as casas decimais.');
    return false;
  }
  return true;
}

function fieldError(fieldName, extra = '') {
  if (!extra) alert(`O campo ${fieldName} não pode estar vazio!`);
  else alert(`Erro no campo ${fieldName}. ${extra}!`);
}
