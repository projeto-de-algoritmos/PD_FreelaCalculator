function knapsack() {
    const qtdHoras = Number(horasDisponiveis);
    const qtdTarefas = tasks.length
    let tarefas = [0, ...tasks]
    
    // Crio a matriz
    const memoization = [];
    console.log(tarefas)
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
            const horasAtual = tarefas[i].duracao
            const valorComNovoItem = valorAtual + memoization[i-1][w-horasAtual]
          
          if (naoLevar > valorComNovoItem) {
            memoization[i][w] = naoLevar
          } else {
            memoization[i][w] = valorComNovoItem;
          }
        }
      }
    }
    console.log(memoization)
    const resultado = findSolution(memoization, horasDisponiveis);
  
    return resultado;
  }