import React from 'react'
import CourseListItem from './CourseListItem'
import { Route, Switch } from "react-router-dom";
import {connect} from 'react-redux'
import { Grid, Dropdown } from 'semantic-ui-react'
import {inputtingSearch} from '../redux/actions'
import Searchbar from './Searchbar'
import CourseDropdown from './CourseDropdown'

class CourseList extends React.Component{
    constructor(){
        super()
        this.state = {
            courses: ""
        }
    }

    componentDidMount(){
        // console.log("mounted", this.props)
    }

    handleChange = (event) => {
        console.log(event.target.value)
    }

    render(){
        // console.log("sorted courses", this.props.courses)
        return(
            <div>
                <div>
                    <div clasName="course-container-div">
                        <div className="courses-top-div">
                                    <Searchbar />
                            <div className="course-dropdown-container-div">
                                        <CourseDropdown />
                            <div>
                        </div>
                        <br></br><br></br><br></br><br></br><br></br><br></br>
                    </div>
                        </div>
                        <br></br><br></br>
                        <div className="course-container">
                            <Grid relaxed columns={4}>
                                {this.props.courses.map(course => {
                                    return ( 
                                        <Grid.Column>
                                            <CourseListItem key={course.id} course={course}/>
                                        </Grid.Column>
                                    )
                                })}
                            </Grid>
                        </div>
                    </div>
                </div>
                <br></br><br></br><br></br>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log("the state you need to manipulate", state)
    if(state.dropdownPrice[1] > 0){
        return {
            courses: state.courses.filter(
                c => {
                    return (
                        c.price >= state.dropdownPrice[0] && c.price <= state.dropdownPrice[1]
                    )
                }
            )
        }
    }else{
    return {
    courses: state.courses.filter(
        c => {
        return (
            c.name.toLowerCase().includes(state.searchText.toLowerCase()) ||
            c.subject.toLowerCase().includes(state.searchText.toLowerCase()) ||
            c.company.name.toLowerCase().includes(state.searchText.toLowerCase()) ||
            c.duration.toLowerCase().includes(state.searchText.toLowerCase()) ||
            c.difficulty_level.toLowerCase().includes(state.searchText.toLowerCase())

        )})
    }};
};

export default connect(mapStateToProps, null)(CourseList)
// export default connect(mapStateToProps, null)(CourseContainer)
// export default CourseList