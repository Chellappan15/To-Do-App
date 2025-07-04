import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E2F',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF9800',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#F28B82',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 2,
    paddingBottom: 100,
    paddingTop: 2,
  },
  renderLeftActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#00FF00',
    borderRadius: 10,
  },
  renderRightActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#DC3545',
    borderRadius: 10,
  },
  leftIcon: {
    paddingLeft: 10,
  },
  rightIcon: {
    paddingRight: 10,
  },
  taskItem: {
    backgroundColor: '#0D1B2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#3A86FF',
    borderWidth: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#F0F0F0',
  },
  completed: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#00BCD4',
  },
  taskDate: {
    color: 'white',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
});
