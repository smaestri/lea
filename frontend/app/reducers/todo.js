const todoReducer = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_TODO':
		return [...state, {
			id: action.id,
			text: action.text
		}];
        case 'DELETE_TODO':
            var newArray = state.filter( (obj) => obj.id != action.id);
            return newArray;
	default:
		return state
	}
};

export default todoReducer