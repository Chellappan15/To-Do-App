import { addNewTask, deleteTask, init } from "../constants/constants";

export default function Reducer(state = { tasks: [] }, action) {
    switch (action.type) {
        case init:
            return {
                ...state,
                tasks: action.payload
            };

        case addNewTask:
            return {
                ...state,
                tasks: [...state.tasks, action.payload]
            };

        case deleteTask:
            return {
                ...state,
                tasks: state.tasks.filter((_, i) => i !== action.payload)
            };

        case 'reset':
            return {
                ...state,
                tasks: []
            };

        default:
            return state;
    }
}
