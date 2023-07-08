class Task {
  id;
  nome;
  duracao;
  preco;

  getDurationInMinutes() {
    return this.minutos + this.horas * 60 + this.dias * 24 * 60;
  }

  constructor(formValue) {
    this.nome = formValue[elementsId['nome']];
    this.duracao = Number(formValue[elementsId['duracao']]);
    this.preco = Number(formValue[elementsId['preco']]);
  }


  toString() {
    return `${this.nome} (R$${this.preco})`;
  }

  toTableRow(headers, deletable = true) {
    let row = '<tr>';

    for (const h of headers) {
      const value = this[h.toLowerCase().replaceAll(' ', '_')];
      row += '<td>' + value + '</td>';
    }
    if (deletable) {
      row += `<td style="text-align: center"><i onclick= "deleteTask(${this.id})" class="fa-regular fa-trash-can" style="cursor: pointer;"></i></td>`;
    }
    return row + '</tr>';
  }
}

