// Link do repositório para o link de informações
const repoUrl = 'https://github.com/projeto-de-algoritmos/PD_FreelaCalculator';
let horasDisponiveis = 0;

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

function findSolution(memoization) {
  resultado = [];

  let linha = tasks.length;
  let coluna = Number(horasDisponiveis);
  const totalValue = memoization[linha][coluna];
  let totalObjects = 0;

  // @TODO: verificar caso no qual nenhum objeto cabe na mochila
  // Enquanto não chegar em uma coluna ou coluna que o valor é zero
  // continua buscando de onde veio o valor da celula
  while (linha != 0 || coluna != 0) {
    // verifico se veio de não pegar o objeto na posição
    // memoization[linha][coluna], pois está igual ao da linha de cima
    // se não peguei o objeto vou para linha de cima, caso contrario
    // peguei o objeto e vou para linha de cima menos o peso do objeto
    if (totalValue == memoization[linha-1][coluna]) {
      linha = linha-1;
    } else {
      resultado[totalObjects] = tasks[linha];
      totalObjects = totalObjects + 1;
      linha = linha - 1;
      coluna = coluna - tasks[linha].duracao;
    }
  }

  return resultado;
}

function knapsack() {
  const qtdHoras = Number(horasDisponiveis);
  const qtdTarefas = tasks.length
  
  // Crio a matriz
  const memoization = [];
  
  for (let i = 0 ; i <= qtdTarefas; i++){
    memoization[i]= []
    for (let j = 0; j <= qtdHoras; j++){
      memoization[i][j]= -1
    }
  }

  // inicializo a primeira linha com 0's
  for (let col = 0; col <= qtdHoras; col++) {
    memoization[0][col] = 0;
  }

  // inicializo a primeira coluna com 0's
  for (let lin = 0; lin <= tasks.length; lin++) {
    memoization[lin][0] = 0;
  }

  // percorro toda a matriz
  for (let j = 1; j <= qtdHoras; j++) {
    for (let i = 1; i <= qtdTarefas; i++) {
      // assim evitanto um acesso a uma região não alocada de memória
      // se o meu item não cabe na mochila decido não levar
      
      if (tasks[i-1].duracao > i) {
        memoization[j][i] = memoization[j-1][i];
      } else {
        // se o meu item cabe na mochila vejo o que é melhor
        // a celula de cima da mochila com os itens presentes nela com aquele mesmo peso ou
        // a celula de cima da mochila com os itens presentes nela quando ela tinha peso
        // suficiente para levar o item mais o valor do novo item
        const valorComNovoItem = tasks[i-1].preco + memoization[j-1][i-tasks[i-1].duracao];
        if (memoization[j-1][i] > valorComNovoItem ) {
          memoization[j][i] = memoization[j-1][i];
        } else {
          memoization[j][i] = valorComNovoItem;
        }
      }
    }
  }
  console.log(memoization)
  const resultado = findSolution(memoization, horasDisponiveis);

  return resultado;
}


// Organiza as tarefas que devem ser feitas
function scheduleTasks() {
  
  if (tasks.length == 0) {
    return false;
  }

  // @TODO: corrigir passagem de parâmetro e remover console.log depois dos testes
  const tarefas = knapsack();
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
