function knapsack() {
    const qtdHoras = Number(horasDisponiveis);
    const qtdTarefas = tasks.length
    // Criando um vetor de tarefas iniciando na posição 1, para alinhar com os iteradores da matriz.
    let tarefas = [0, ...tasks]
    
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
    for (let lin = 0; lin <= qtdTarefas; lin++) {
      memoization[lin][0] = 0;
    }
    
    // percorro toda a matriz
    // assim evitando um acesso a uma região não alocada de memória
    for (let i = 1; i <= qtdTarefas; i++) {
        for (let w = 1; w <= qtdHoras; w++) {
        // se o meu item não cabe na mochila (com peso atual w) decido não levar 
        // nesse caso: OPT(i,w)=OPT(i-1,w)        
        if (tarefas[i].duracao > w) {
          memoization[i][w] = memoization[i-1][w];
        } else {
            // se o meu item cabe na mochila vejo o que é melhor
            // a celula de cima da mochila com os itens presentes nela com aquele mesmo peso ou
            // a celula de cima da mochila com os itens presentes nela quando ela tinha peso
            // suficiente para levar o item mais o valor do novo item
            //  OPT(i,w) = max(OPT(i-1,w),  // Não levar
            //                  v_i + OPT(i-1, w-w_i)) // Levar
            const naoLevar = memoization[i-1][w]
            const valorAtual = tarefas[i].preco
            const duracaoAtual = tarefas[i].duracao
            const levar = valorAtual + memoization[i-1][w-duracaoAtual]
            
            memoization[i][w] = Math.max(naoLevar, levar);
        }
      }
    }
    alert(`O maior faturamento possível é de R$${memoization[qtdTarefas][qtdHoras]}!`)
    findSolution(memoization);
  }


function findSolution(memoization) {
  
    let i = tasks.length; // Iterador de linhas da matriz
    let j = Number(horasDisponiveis); // Iterador de colunas da matriz
    const valorMax = memoization[i][j];
  
    // Enquanto não chegar em uma coluna ou coluna que o valor é zero
    // continua buscando de onde veio o valor da celula
    while (i >0  && j > 0) {
      // verifico se veio de não pegar o objeto na posição
      // memoization[linha][coluna], pois está igual ao da linha de cima
      // se não peguei o objeto vou para linha de cima, sem adicionar nenhuma tarefa ao resultado
      if (valorMax == memoization[i-1][j]) {
        i = i-1;
        // caso contrario
      // peguei o objeto e vou para linha de cima menos o peso do objeto
      } else {
        tarefasSelecionadas.addTask(tasks[i-1])
        i = i - 1; // subindo uma linha 
        j = Math.max(j - tasks[i].duracao,0);
      }
    }
    renderTasks(steps[2])
  }
  