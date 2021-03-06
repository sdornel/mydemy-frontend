import { combineReducers } from "redux";

const coursesReducer = (state = [], action) => {
    switch (action.type) {
        case "FETCHED_COURSES":
            return action.payload
        case "CREATED_NEW_COURSE":
            let newState = [...state, action.payload]
            return newState
        case "DELETED_COURSE":
            let filtered = state.filter(c => c.id !== action.payload.id)
            return filtered
        case "CHANGED_COMPANY_NAME_OF_COURSE":
            return state
        default:
            return state;
    }
}

const userReducer = (state = [], action) => {
    switch (action.type) {
        case "FETCHED_USER":
            return {...state, currentUser: action.payload}
        case "GOT_PROFILE_FETCH":
            return {...state, currentUser: action.payload}
        case "LOGOUT_USER":
            return {...state, currentUser: null}
        case "EDITED_USER_INFO":
            return {...state, currentUser: action.payload}
        default:
            return state;
    }
}

const allUsersReducer = (state = [], action) => {
    switch(action.type) {
        case "FETCHED_ALL_USERS":
            return action.payload
        default:
            return state;
    }
}

const companyReducer = (state = [], action) => {
    switch (action.type) {
        case "FETCHED_COMPANY":
            return {...state, currentCompany: action.payload}
        case "GOT_COMPANY_PROFILE_FETCH":
            return {...state, currentCompany: action.payload}
        case "LOGOUT_USER":
            return {...state, currentCompany: null}
        case "COMPANY_FETCHED_PURCHASES":
            return action.payload
        case "EDITED_COMPANY_INFO":
            return {...state, currentCompany: action.payload}
        case "DELETED_COURSE_FROM_COMPANY":
            let filteredState = {...state}
            return filteredState
        case "CREATED_NEW_COMPANY_COURSE":
            let addedNewCourse = {...state}
            return addedNewCourse
        default:
            return state;
    }
}

const newLessonReducer = (state = [], action) => {
    switch (action.type){
        case "CREATED_NEW_LESSON":
            return action.payload
        default:
            return state;
    }
}

const finalLessonReducer = (state = [], action) => {
    switch (action.type){
        case "ADDED_FINAL_LESSON":
        return action.payload
        default:
            return state
    }
}

const cartReducer = (state = [], action) => {
    switch (action.type) {
        case "FETCHED_USER_CART":
            return action.payload
        case "ADD_TO_CART":
            // let newState = [action.payload, ...state] // state defaulted to an array here
            // let newState = [...action.payload] // state defaulted to an array here
            let newState = action.payload
            return newState
        case "ALREADY_OWNED":
            return state
        case "CHECKOUT_CART":
            return action.payload
        case "REMOVED_FROM_CART":
            let stateWithoutRemovedItem = state.filter(p => p.id !== action.payload.id) 
            // return {...stateWithoutRemovedItem} // this was returning state as an object which interfered with show cart
            return [...stateWithoutRemovedItem]
        default:
            return state;
    }
}

const cartTotalReducer = (state = 0, action) => {
    switch (action.type){
        case "CART_TOTAL":
            return {
                cartTotal: action.payload
            }
        default:
            return state;
    }
}

const totalRevenueReducer = (state = {}, action) => {
    switch (action.type){
        case "FETCHED_TOTAL_REVENUE":
            // let newState = {...state}

            return {
                totalRevenue: action.payload
            }
        default:
            return state;
    }
}

const selectCourseReducer = (state = [], action) => {
    switch (action.type){
        case "EDIT_SELECTED_COURSE":
            return {
                course: action.payload
            }
        case "EDITED_COURSE":
            let updatedCourse = {selectedCourse: action.payload}
            let updated = {...updatedCourse} // something goes wrong here with regards to rendering patch
            return updated
        default:
            return state;
    }
}

const selectCourseLessonsReducer = (state = [], action) => {
    switch (action.type){
        case "FETCHED_LESSONS":
            return action.payload
        default:
            return state
    }
}

const lessonReducer = (state = [], action) => {
    switch (action.type){
        case "SELECTED_LESSON":
            return action.payload
        case "CLICKED_BACK_BUTTON":
            return action.payload
        default:
            return state
    }
}

const searchTextReducer = (state = "", action) => {
    switch (action.type) {
      case "CHANGE_SEARCH_TEXT":
        return action.payload;
      default:
        return state;
    }
};

const dropdownDurationReducer = (state = "", action) => {
    switch (action.type) {
        case "SORTED_BY_DURATION":
            return action.payload;
        default:
            return state;
    }
}

const dropdownPriceReducer = (state = "", action) => {
    switch (action.type) {
        case "SORTED_BY_PRICE":
            return action.payload;
        default:
            return state;
    }
}

const dropdownDifficultyLevelReducer = (state = "", action) => {
    switch (action.type) {
        case "SORTED_BY_DIFFICULTY_LEVEL":
            return action.payload;
        default:
            return state;
    }
}

const enlargedCourseReducer = (state = "", action) => {
    switch (action.type) {
        case "FETCHED_ENLARGED_COURSE":
            return action.payload;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    enlargedCourse: enlargedCourseReducer,
    courses: coursesReducer,
    user: userReducer,
    cart: cartReducer,
    totalRevenue: totalRevenueReducer,
    //cartTotal may not be needed
    cartTotal: cartTotalReducer,
    checkoutCart: cartReducer,
    company: companyReducer,
    selectedCourse: selectCourseReducer,
    allUsers: allUsersReducer,
    searchText: searchTextReducer,
    dropdownDuration: dropdownDurationReducer,
    dropdownPrice: dropdownPriceReducer,
    dropdownDifficultyLevel: dropdownDifficultyLevelReducer,
    lessons: selectCourseLessonsReducer,
    selectedLesson: lessonReducer,
    newLesson: newLessonReducer,
    finalLesson: finalLessonReducer, 
    // addedNewLesson: addingLessonsReducer
  });
  
  export default rootReducer;