import { connect } from "react-redux";
import TaskList from "../../components/TaskList";

const mapStateToProps = (state) => ({
  tasks: state.tasks,
});

const HomeScreen = connect(mapStateToProps)(TaskList);

export default HomeScreen;