// CREATE TASK ID COUNTER

const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

const taskCounter = (() => {
    let lastTaskNumber = 0;
    return () => {
        lastTaskNumber += 1;
        return lastTaskNumber;
    };
})();

// TASKS CONTROLLER

// 1. CREATE 

const create = async ( req, res) => {
    if (!req.body) req.body = {};
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const newTask = {
        id: taskCounter(),
        userId: global.user_id.email,
        ...value,
    };
    global.tasks.push(newTask);
    
    const { userId, ...sanitizedTask } = newTask;
    return res.status(201).json(sanitizedTask);
};




// 2. INDEX

const index = (req, res) => {
    const userTasks = global.tasks.filter(
        (tasks) => tasks.userId === global.user_id.email
    );
    if (userTasks.length === 0) {
        return res.status(404).json({ message: "No tasks found for this user" });
    }
    const sanitizedTasks = userTasks.map(({ userId, ...task }) => task);
    return res.status(200).json(sanitizedTasks);
};


// 3. SHOW

const show = (req, res) => {
    const taskId = parseInt(req.params?.id);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = global.tasks.find(task => task.id === taskId && task.userId === global.user_id.email);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const { userId, ...sanitizedTask } = task;
    return res.status(200).json(sanitizedTask); 
}


// 4. UPDATE
const update = (req, res) => {
    if (!req.body) req.body = {};
    const { error, value } = patchTaskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const taskId = parseInt(req.params?.id);
    if (isNaN(taskId)) {
        return res.status(404).json({ message: "Invalid task ID" });
    }
    const task = global.tasks.find(
        task => task.id === taskId && task.userId === global.user_id.email
    );
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, value);
    const { userId, ...sanitizedTask } = task;
    return res.status(200).json(sanitizedTask);
};

// 5. deleteTask

const deleteTask = (req, res) => {
    const taskId = parseInt(req.params?.id);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    const taskIndex = global.tasks.findIndex(task => task.id === taskId && task.userId === global.user_id.email);
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }
    const task = global.tasks[taskIndex];
    const { userId, ...sanitizedTask } = task;
    global.tasks.splice(taskIndex, 1);
    return res.status(200).json(sanitizedTask);
};

module.exports = {
    create,
    index,
    show,
    update,
    deleteTask,
};

