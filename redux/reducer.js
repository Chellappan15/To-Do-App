import { addNewTask, completeTask, deleteTask, init } from "../constants/constants";

export default function Reducer(state = { tasks: [] }, action) {
    switch (action.type) {
        case init:
            return {
                tasks: action.payload
            };

        case addNewTask:
            return {
                tasks: [...state.tasks, action.payload]
            };

        case removeTask:
            return {
                tasks: state.tasks.filter((_, i) => i !== action.payload)
            };

        case completeTask:
            const updated = state.tasks.map((task, i) =>
                i === action.payload ? { ...task, completed: !task.completed, completedDate: action.date } : task
            );
            return {
                tasks: updated
            }

        case 'reset':
            return {
                tasks: []
            };

        default:
            console.log('From reducer: ', state);
            return state;
    }
}
