
class Task {
  storage = localStorage.getItem('data')
  parseStorage = this.storage ? JSON.parse(this.storage) : []
  data = this.parseStorage
  formCreateElement:any
  listElement:HTMLElement
  inputSearchElement:HTMLElement
  selectSortElement: HTMLElement
  isEdit:boolean

  constructor () {
    this.formCreateElement = document.querySelector('#formCreate')
    this.listElement = document.querySelector('#list')
    this.inputSearchElement = document.querySelector('#search')
    this.selectSortElement = document.querySelector('#sort')
    this.isEdit = false

    this.formCreateElement.addEventListener('submit', this.handleSubmitFormCreate.bind(this))
    this.listElement.addEventListener('change', this.handleTodoChange.bind(this))
    this.listElement.addEventListener('click', this.handleRemoveTodo.bind(this))
    this.listElement.addEventListener('click', this.handleEditTodo.bind(this))
    this.listElement.addEventListener('submit', this.handleSubmitFormEdit.bind(this))
    this.inputSearchElement.addEventListener('input', this.handleInputFilterForm.bind(this))
    this.selectSortElement.addEventListener('change', this.handleChangeSort.bind(this))
    window.addEventListener('beforeunload', () => {
      const string = JSON.stringify(this.data)
      localStorage.setItem('data', string)
    })
    document.addEventListener('DOMContentLoaded', () => this.render(this.data))
  }

  handleSubmitFormCreate (event:any) {
    event.preventDefault()
    const date = new Date()
    const daada = date.getFullYear()

    interface TodoInterface {
      createdAt?:number,
      id:number,
      isChecked?: boolean,
      priority?:string,
      title?: string,
      estimate?:string,
    }

    const todo:TodoInterface = {
      createdAt: daada,
      id: date.getTime(),
      isChecked: false
    }
    console.log(todo)
    const formData = new FormData(this.formCreateElement)
    for (const [value] of formData) {
      todo.title = value
    }
    this.data.push(todo)
    this.render(this.data)
    this.formCreateElement.reset()
  }

  handleInputFilterForm (event:any) {
    event.preventDefault()
    const { target } = event
    const searchString = target.value
    const matches = this.data.filter((item:any) => item.title.includes(searchString))
    this.render(matches)
  }

  handleChangeSort (event:any) {
    const { target } = event
    const { value } = target
    console.log(value)
    let sortData = []
    console.log(this.data)

    if (value) {
      sortData = this.data.sort((a:string, b:string) => {
        return +a[value] - +b[value]
      })
    } else {
      sortData = this.data
    }
    this.render(sortData)
  }

  handleSubmitFormEdit (event:any) {
    event.preventDefault()
    const { target } = event
    const inputElement = target.querySelector('input[name="title"]')
    const { value } = inputElement
    const { id } = target.dataset
    this.data.forEach((item:any) => {
      if (item.id === id) {
        item.title = value
      }
    })
    const parent = target.closest('.island__item')
    parent.classList.remove('island__item_edit')
    this.isEdit = false
    this.render(this.data)
  }

  buildDate (date:any) {
    const objectDate = new Date()
    const dateCreate = this.transformData(objectDate.getDate())
    const monthCreate = this.transformData(objectDate.getMonth() + 1)
    const yearCreate = objectDate.getFullYear()
    return `${dateCreate}.${monthCreate}.${yearCreate}`
  }

  transformData (time:any) {
    return time < 10 ? `0${time}` : time
  }

  todoTemplate ({ title, id, isChecked, createdAt, estimate, priority, isEdit }:any) {
    const dateCreateAt = this.buildDate(createdAt)
    let priorityForm = `${priority}`
    priorityForm = this.buildPriorityForm(priorityForm)
    const attrId = 'todo' + id
    const attrChecked = isChecked ? 'checked' : ''
    const estimateInput = estimate ? `${estimate}ч.` : ''
    return `

      <div class="island__item  ${isChecked ? 'island__item_checked' : ''}">
      <div class="form-check">
      <div class="form-check_primary">
      <div class="form-check_primary_item">
          <input
          class="form-check-input"
          type="checkbox" id="${attrId}" ${attrChecked} data-id="${id}">

          <label data-id="${id}" for="${attrId}">
          ${title}
          </label>
          <form action="" class="form-edit"  data-id="${id}">
              <input type="text" class="island__input_edit" name="title" placeholder="" value="${title}" >
              <button type="submit" class="button-save"></button>
          </form>
          </div>
          <button class="button_edit" data-id="${id}" type="button" data-role="edit"></button>
          <div class="form-create-data">${dateCreateAt}</div>
          </div>
          <div class="form-check_secondory">

          <button class="btn-remove" data-id="${id}" data-role="remove"></button>
          <span class="star">${priorityForm}</span>
          <span class="estimate">${estimateInput}</span>
          </div>
          </div>
          </div>
      `
  }

  handleEditTodo (event:any) {
    const { target } = event
    if (target.dataset.role !== 'edit') return
    if (this.isEdit) {
      alert('Задача уже редактируется!')
      return
    }
    const parent = target.closest('.island__item')
    parent.classList.add('island__item_edit')
    this.isEdit = true
  }

  buildPriorityForm (priorityForm:any) {
    const imgStar = '⭐'
    let sum = ' '
    for (let i = 0; i < priorityForm; i++) {
      sum = sum + imgStar
    }
    priorityForm = sum
    return priorityForm
  }

  handleTodoChange (event:any) {
    console.log(typeof (event))
    const { target } = event
    const { id } = target.dataset
    if (target.type != 'checkbox') return
    this.data.forEach((item:any) => {
      console.log(typeof (item))
      if (item.id == id) {
        item.isChecked = target.checked
      }
    })
    const parent = target.closest('.island__item')
    parent.classList.toggle('island__item_checked')
  }

  handleRemoveTodo (event:any) {
    const { target } = event
    if (target.dataset.role != 'remove') return
    const { id } = target.dataset
    this.data.forEach((item:any, index:any) => {
      if (item.id == id) {
        this.data.splice(index, 1)
      }
    })
    this.render(this.data)
  }

  render (todoList:any) {
    let result = ''
    todoList.forEach((todo:any) => {
      const template = this.todoTemplate(todo)
      result = result + template
    })
    this.listElement.innerHTML = result
  }
}

const task = new Task()
