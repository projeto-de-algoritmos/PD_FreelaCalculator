class TaskList extends Array {
  constructor() {
    super();
  }

  add(formValue) {
    const task = new Task(formValue);
    task.id = this.length;
    this.push(task);
    renderTasks();
  }

  addTask(task){
    task.id = this.length;
    this.push(task);
    renderTasks();
  } 

  remove(index) {
    this[index] = null;
    renderTasks();
  }

  toTable(headers, deletable = true) {
    let table = '<table><tr>';
    for (const h of headers) {
      const palavras = h.split(' ');
      const header = palavras.map((p) => {
        return p.toUpperCase().charAt(0) + p.slice(1);
      }).join(' ');
      table += `<th>${header}</th>`;
    }
    if (deletable) {
      table += '<th> Deletar </th>';
    }
    table += '</tr>';

    const tasksHTML = this.map(
        (t) => t ? t.toTableRow(headers, deletable) : '',
    ).join('');
    return table + tasksHTML + '</table>';
  }
}
