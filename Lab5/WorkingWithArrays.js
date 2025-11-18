let todos = [
  { id: 1, title: "Task 1", description: "First task", completed: false },
  { id: 2, title: "Task 2", description: "Second task", completed: true },
  { id: 3, title: "Task 3", description: "Third task", completed: false },
  { id: 4, title: "Task 4", description: "Fourth task", completed: true },
];

export default function WorkingWithArrays(app) {
  // Get all todos or filter by completed status
  const getTodos = (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const completedTodos = todos.filter((t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }
    res.json(todos);
  };

  // Create new todo (old GET version)
  const createNewTodo = (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      description: "New task description",
      completed: false,
    };
    todos.push(newTodo);
    res.json(todos);
  };

  // Create new todo (new POST version)
  const postNewTodo = (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  };

  // Get todo by ID
  const getTodoById = (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json(todo);
  };

  // Delete todo (old GET version)
  const removeTodo = (req, res) => {
    const { id } = req.params;
    todos = todos.filter((t) => t.id !== parseInt(id));
    res.json(todos);
  };

  // Delete todo (new DELETE version with error handling)
  const deleteTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  };

  // Update todo (new PUT version with error handling)
  const updateTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todos = todos.map((t) => {
      if (t.id === parseInt(id)) {
        return { ...t, ...req.body };
      }
      return t;
    });
    res.sendStatus(200);
  };

  // Update todo title (old GET version)
  const updateTodoTitle = (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    todo.title = title;
    res.json(todos);
  };

  // Update todo description (old GET version)
  const updateTodoDescription = (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    todo.description = description;
    res.json(todos);
  };

  // Update todo completed (old GET version)
  const updateTodoCompleted = (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    todo.completed = completed === "true";
    res.json(todos);
  };

  // Route declarations - order matters!
  app.get("/lab5/todos", getTodos);
  app.get("/lab5/todos/create", createNewTodo);
  app.post("/lab5/todos", postNewTodo);
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.delete("/lab5/todos/:id", deleteTodo);
  app.put("/lab5/todos/:id", updateTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
  app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
  app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  app.get("/lab5/todos/:id", getTodoById);
}