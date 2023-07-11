// Link do repositório para o link de informações
const repoUrl = 'https://github.com/projeto-de-algoritmos/PD_FreelaCalculator';


// Todas as tasks cadastradas
const tasks = new TaskList();

// Id dos elementos [Atualizar sempre que alterar no HTML]
const elementsId = {
  form: 'form',
  nome: 'nome',
  duracao: 'duracao',
  preco: 'preco',
  divTaskList: 'taskList',
};

function getFormValue() {
  const formValue = {};
  for (x of document.getElementById('form')) {
    formValue[x.id] = x.value;
  }
  return formValue;
}

function getInfoProjeto() {
  // @TODO: inserir descrição do projeto
  alert('Esse projeto visa organizar os trabalhos de freelancers maximizando o valor recebido.');
  return false;
}

function addTask() {
  const formValue = getFormValue();
  if (validaForm(formValue)) {
    tasks.add(formValue);
    renderTasks(steps[1]);
  }
  return false;
}

function achaResultado(memoization, horasDisponiveis){

  resultado = [];

  let linha = tasks.length;
  let coluna = horasDisponiveis;
  let totalValue = memoization[linha][coluna];
  let totalObjects = 0;

  while(linha != 0 || coluna != 0){

    if(totalValue == memoization[linha-1][coluna]){
      linha = linha-1;
    }else{
      resultado[totalObjects] = tasks[linha];
      linha = linha - 1;
      coluna = coluna - tasks[linha].duracao;
      totalObjects = totalObjects + 1;
    }
  
  }

  return resultado;

}

function knapsack(horasDisponiveis){

  // Crio a matriz
  let memoization = [];
    for(let linha = 0; linha < horasDisponiveis+1; linha ++){
      memoization[linha] = [];
      for(let coluna = 0; coluna < tasks.length+1; coluna++){
        memoization[linha][coluna] = '';
      }
    }
  
  // inicializo a primeira linha com 0's
  for(let linha = 0; linha < horasDisponiveis+1; linha++){
    memoization[linha][0] = 0;
  }

  // inicializo a primeira coluna com 0's
  for(let coluna = 0; coluna < tasks.length+1; coluna++){
    memoization[0][coluna] = 0;
  }

  // percorro toda a matriz
  for(let linha = 1; linha <horasDisponiveis+1; linha++){
    for(let coluna = 1; coluna < tasks.length+1;coluna++){
      
      // assim evitanto um acesso a uma região não alocada de memória
      // se o meu item não cabe na mochila descido não levar
      if(tasks[linha-1].duracao > coluna){
        memoization[linha][coluna] = memoization[linha-1][coluna];
      }else{

        // se o meu item cabe na mochila vejo o que é melhor
        // a celula de cima da mochila com os itens presentes nela com aquele mesmo peso ou 
        // a celula de cima da mochila com os itens presentes nela quando ela tinha peso
        // suficiente para levar o item mais o valor do novo item
        let valorComNovoItem = tasks[linha-1].preco + memoization[linha-1][coluna-tasks[linha-1].duracao];
        if(memoization[linha-1][coluna] > valorComNovoItem ){
          memoization[linha][coluna] = memoization[linha-1][coluna];
        }else{
          memoization[linha][coluna] = valorComNovoItem;
        }
      }
    }
  }

  let resultado = achaResultado(memoization, horasDisponiveis);

  return resultado;
}


// Organiza as tarefas que devem ser feitas
function scheduleTasks() {
  if (tasks.length == 0) {
    return false;
  }
  
  console.log(tarefas);
  // @TODO: corrigir passagem de parâmetro e remover console.log depois dos testes
  let tarefas = knapsack(11);
  console.log(tarefas);

  // Mostrar tarefas selecionadas
  renderTasks(steps[2]);

  document.getElementById('btn-salvar').disabled = false;
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
    document.getElementById(tableIds['lista'].id).innerHTML = tasks.toTable(tableIds['lista'].headers, true);
  }
  if (step == steps[2]) {
    document.getElementById(tableIds['lista'].id).innerHTML = tasks.toTable(tableIds['lista'].headers);
    document.getElementById(tableIds['selecionadas'].id).innerHTML = tasks.toTable(tableIds['selecionadas'].headers);
    document.getElementById('btn-salvar').disabled = false;
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
  const preco = formValue[elementsId['duracao']];
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

function fieldError(fieldName, extra = '') {
  if (!extra) alert(`O campo ${fieldName} não pode estar vazio!`);
  else alert(`Erro no campo ${fieldName}. ${extra}!`);
}
